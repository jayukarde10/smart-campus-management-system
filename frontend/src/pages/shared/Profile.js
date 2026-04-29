import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Camera, Save, CheckCircle, Edit2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import API, { getApiUrl } from '../../services/api';

const Profile = () => {
  const token = localStorage.getItem('token');
  let decoded = {};
  try { decoded = jwtDecode(token); } catch(e) {}

  const [profile, setProfile] = useState({
    name: decoded.name || 'User',
    email: decoded.email || '',
    phone: '',
    address: '',
    department: '',
    year: '',
    bio: '',
    avatar: decoded.avatar || null
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile');
        setProfile(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/profile', profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Update token to reflect new name if needed (optional, requires relogin for full effect)
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await API.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, avatar: res.data.avatar }));
      
      window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: res.data.avatar }));
      alert('Profile photo updated successfully!');
    } catch (err) {
      console.error('Failed to upload avatar', err);
      alert('Failed to upload photo.');
    }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">My Profile</h2>
        <p className="text-muted m-0">Manage your account information and profile photo.</p>
      </div>

      {saved && (
        <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold d-flex align-items-center gap-2">
          <CheckCircle size={18}/> Profile updated successfully!
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="premium-card p-4 text-center position-relative">
            <div className="position-relative d-inline-block mb-3">
              {profile.avatar ? (
                <img 
                  src={`${getApiUrl()}${profile.avatar}`} 
                  alt="Profile" 
                  className="rounded-circle object-fit-cover shadow-sm"
                  style={{ width: '120px', height: '120px', border: '4px solid white' }}
                />
              ) : (
                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                     style={{ width: '120px', height: '120px', fontSize: '42px', background: 'linear-gradient(135deg, var(--primary), #818cf8)', border: '4px solid white' }}>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <button 
                className="btn btn-primary rounded-circle p-2 position-absolute shadow"
                style={{ bottom: '0', right: '0' }}
                onClick={() => fileInputRef.current.click()}
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="d-none" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </div>

            <h5 className="fw-bold mb-1">{profile.name}</h5>
            <p className="text-muted small mb-3">{profile.email}</p>
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-4 py-2 text-uppercase fw-bold">
              {decoded.role || 'Student'}
            </span>
            
            <hr className="my-4"/>
            <div className="text-start">
              <div className="d-flex align-items-center gap-2 mb-3 text-muted small"><Mail size={16}/> {profile.email}</div>
              {profile.phone && <div className="d-flex align-items-center gap-2 mb-3 text-muted small"><Phone size={16}/> {profile.phone}</div>}
              {profile.address && <div className="d-flex align-items-center gap-2 mb-3 text-muted small"><MapPin size={16}/> {profile.address}</div>}
              {profile.department && <div className="d-flex align-items-center gap-2 text-muted small"><BookOpen size={16}/> {profile.department} {profile.year && `(${profile.year})`}</div>}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4"><User size={20} className="text-primary me-2"/>Edit Profile</h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Full Name</label>
                <input className="premium-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Email</label>
                <input className="premium-input" value={profile.email} disabled style={{opacity:0.6}}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Phone</label>
                <input className="premium-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+91 XXXXX XXXXX"/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Department</label>
                <input className="premium-input" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} placeholder="e.g. Computer Science"/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Year / Semester</label>
                <input className="premium-input" value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})} placeholder="e.g. 3rd Year"/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Address</label>
                <input className="premium-input" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="City, Country"/>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small">Bio</label>
                <textarea className="premium-input" rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell us a little about yourself..."/>
              </div>
              <div className="col-12 mt-4">
                <button className="btn-dynamic py-3 px-5" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : <><Save size={18}/> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

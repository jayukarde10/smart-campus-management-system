import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Camera, Save, CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const token = localStorage.getItem('token');
  let decoded = {};
  try { decoded = jwtDecode(token); } catch(e) {}

  const [profile, setProfile] = useState({
    name: decoded.name || 'User',
    email: decoded.email || 'user@campus.edu',
    phone: '+91 98765 43210',
    address: 'Smart Campus, Pune, India',
    department: 'Computer Science',
    bio: 'A passionate learner and technology enthusiast.'
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">My Profile</h2>
        <p className="text-muted m-0">Manage your account information.</p>
      </div>

      {saved && (
        <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold d-flex align-items-center gap-2">
          <CheckCircle size={18}/> Profile updated successfully!
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="premium-card p-4 text-center">
            <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mb-3"
                 style={{ width: '100px', height: '100px', fontSize: '36px', background: 'linear-gradient(135deg, var(--primary), #818cf8)' }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h5 className="fw-bold mb-1">{profile.name}</h5>
            <p className="text-muted small mb-3">{profile.email}</p>
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-4 py-2">{decoded.role || 'Student'}</span>
            <hr className="my-4"/>
            <div className="text-start">
              <div className="d-flex align-items-center gap-2 mb-3 text-muted small"><Mail size={16}/> {profile.email}</div>
              <div className="d-flex align-items-center gap-2 mb-3 text-muted small"><Phone size={16}/> {profile.phone}</div>
              <div className="d-flex align-items-center gap-2 mb-3 text-muted small"><MapPin size={16}/> {profile.address}</div>
              <div className="d-flex align-items-center gap-2 text-muted small"><BookOpen size={16}/> {profile.department}</div>
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
                <input className="premium-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}/>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Department</label>
                <input className="premium-input" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})}/>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small">Address</label>
                <input className="premium-input" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})}/>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small">Bio</label>
                <textarea className="premium-input" rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}/>
              </div>
              <div className="col-12 mt-3">
                <button className="btn-dynamic py-3 px-5" onClick={handleSave}><Save size={18}/> Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

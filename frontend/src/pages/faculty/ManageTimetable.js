import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Save, Upload, FileText, Image } from 'lucide-react';
import API from '../../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ManageTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [activeDay, setActiveDay] = useState('Monday');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [ttFile, setTtFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchTimetable(); }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await API.get('/faculty/timetable');
      const mapped = {};
      DAYS.forEach(d => { mapped[d] = []; });
      res.data.forEach(e => { mapped[e.day] = e.periods || []; });
      setTimetable(mapped);
    } catch (err) {
      const empty = {};
      DAYS.forEach(d => { empty[d] = []; });
      setTimetable(empty);
    } finally { setLoading(false); }
  };

  const addPeriod = () => {
    setTimetable(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), { time: '', subject: '', room: '', type: 'Lecture' }]
    }));
  };

  const removePeriod = (i) => {
    setTimetable(prev => ({ ...prev, [activeDay]: prev[activeDay].filter((_, idx) => idx !== i) }));
  };

  const updatePeriod = (i, field, value) => {
    setTimetable(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    }));
  };

  const saveDay = async () => {
    setSaving(true);
    try {
      await API.post('/faculty/timetable', { day: activeDay, periods: timetable[activeDay] });
      setMsg(`${activeDay} timetable saved!`);
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleFileUpload = async () => {
    if (!ttFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', ttFile);
      formData.append('title', 'Timetable - ' + new Date().toLocaleDateString());
      formData.append('content', 'Updated timetable shared by faculty.');
      await API.post('/faculty/timetable/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Timetable image/PDF shared to all students!');
      setTtFile(null);
      setTimeout(() => setMsg(''), 4000);
    } catch { setMsg('Failed to upload.'); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-secondary"></div></div>;

  const periods = timetable[activeDay] || [];

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Timetable Management</h2>
        <p className="text-muted m-0">Create weekly timetable or share image/PDF with students.</p>
      </div>

      {msg && <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold">{msg}</div>}

      {/* Upload Image/PDF Card */}
      <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Image size={20} className="text-accent" /> Share Timetable Image / PDF
        </h5>
        <p className="text-muted small mb-3">Upload a photo or PDF of the timetable. It will appear on every student's Timetable and Notices page.</p>
        <div className="d-flex gap-3 align-items-end flex-wrap">
          <input type="file" className="form-control" style={{ maxWidth: '350px' }}
            accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={e => setTtFile(e.target.files[0])} />
          {ttFile && <small className="text-muted">📄 {ttFile.name}</small>}
          <button className="btn-dynamic" style={{ backgroundColor: 'var(--accent)' }}
            onClick={handleFileUpload} disabled={!ttFile || uploading}>
            {uploading ? 'Uploading...' : 'Share to Students'} <Upload size={16} />
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="premium-card overflow-hidden mb-4">
        <div className="d-flex overflow-auto border-bottom">
          {DAYS.map(day => (
            <button key={day}
              className={`py-3 px-4 fw-bold border-0 bg-transparent flex-shrink-0 ${activeDay === day ? 'border-bottom border-3 text-secondary' : 'text-muted'}`}
              style={{ borderColor: activeDay === day ? 'var(--secondary)' : 'transparent' }}
              onClick={() => setActiveDay(day)}>
              {day}
              {(timetable[day]?.length > 0) && <span className="badge bg-secondary ms-2 rounded-pill">{timetable[day].length}</span>}
            </button>
          ))}
        </div>
        <div className="p-4">
          {periods.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <Calendar size={40} className="mb-3 opacity-50" />
              <p>No periods for {activeDay}. Click Add Period.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {periods.map((p, i) => (
                <div key={i} className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3 flex-wrap" style={{ borderLeft: '4px solid var(--secondary)' }}>
                  <span className="text-muted fw-bold">#{i+1}</span>
                  <input className="premium-input" style={{maxWidth:'150px'}} placeholder="Time" value={p.time} onChange={e => updatePeriod(i,'time',e.target.value)} />
                  <input className="premium-input flex-grow-1" placeholder="Subject" value={p.subject} onChange={e => updatePeriod(i,'subject',e.target.value)} />
                  <input className="premium-input" style={{maxWidth:'120px'}} placeholder="Room" value={p.room} onChange={e => updatePeriod(i,'room',e.target.value)} />
                  <select className="premium-input" style={{maxWidth:'120px'}} value={p.type} onChange={e => updatePeriod(i,'type',e.target.value)}>
                    <option>Lecture</option><option>Practical</option><option>Tutorial</option><option>Break</option>
                  </select>
                  <button className="btn btn-sm btn-outline-danger rounded-circle p-2" onClick={() => removePeriod(i)}><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          )}
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2 fw-bold" onClick={addPeriod}><Plus size={18}/> Add Period</button>
            <button className="btn-dynamic" style={{backgroundColor:'var(--secondary)'}} onClick={saveDay} disabled={saving}>
              {saving ? 'Saving...' : `Save ${activeDay}`} {!saving && <Save size={18}/>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTimetable;

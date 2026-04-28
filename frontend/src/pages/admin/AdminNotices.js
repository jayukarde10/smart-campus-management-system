import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Plus, Trash2, Upload } from 'lucide-react';
import API from '../../services/api';

const AdminNotices = () => {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', location: '', category: 'General' });
  const [showEventForm, setShowEventForm] = useState(false);

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeType, setNoticeType] = useState('notice');
  const [noticeFile, setNoticeFile] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get('/admin/events');
      setEvents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/events', eventForm);
      setMsg('Event created!');
      setEventForm({ title: '', description: '', date: '', time: '', location: '', category: 'General' });
      setShowEventForm(false);
      fetchEvents();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed.'); }
  };

  const deleteEvent = async (id) => {
    try { await API.delete(`/admin/events/${id}`); fetchEvents(); } catch (err) { console.error(err); }
  };

  const publishNotice = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', noticeTitle);
      formData.append('content', noticeContent);
      formData.append('type', noticeType);
      if (noticeFile) formData.append('file', noticeFile);
      await API.post('/admin/notices', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Notice published!');
      setNoticeTitle(''); setNoticeContent(''); setNoticeType('notice'); setNoticeFile(null);
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed.'); }
  };

  const catColors = { General: '#4F46E5', Technical: '#10B981', Cultural: '#EC4899', Sports: '#F59E0B', Academic: '#8B5CF6' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Events & Notifications</h2>
        <p className="text-muted m-0">Manage campus events and publish system-wide notifications.</p>
      </div>

      {msg && <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold">{msg}</div>}

      {/* Tabs */}
      <div className="d-flex mb-4 bg-light rounded-3 p-1">
        {[
          { key: 'events', label: 'Events', icon: <Calendar size={16}/> },
          { key: 'notices', label: 'Publish Notice', icon: <Bell size={16}/> }
        ].map(t => (
          <button key={t.key}
            className={`flex-1 py-2 px-4 rounded-2 border-0 fw-bold d-flex align-items-center justify-content-center gap-2 w-50
              ${tab === t.key ? 'bg-white shadow-sm' : 'bg-transparent text-muted'}`}
            onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'events' ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button className="btn-dynamic" style={{ backgroundColor: '#F59E0B' }} onClick={() => setShowEventForm(!showEventForm)}>
              <Plus size={18}/> {showEventForm ? 'Cancel' : 'New Event'}
            </button>
          </div>

          {showEventForm && (
            <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid #F59E0B' }}>
              <form onSubmit={createEvent}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold text-muted small">Title *</label>
                    <input className="premium-input" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold text-muted small">Date *</label>
                    <input type="date" className="premium-input" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold text-muted small">Time</label>
                    <input className="premium-input" placeholder="10:00 AM" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold text-muted small">Location</label>
                    <input className="premium-input" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-bold text-muted small">Category</label>
                    <select className="premium-input" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})}>
                      <option>General</option><option>Technical</option><option>Cultural</option><option>Sports</option><option>Academic</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold text-muted small">Description</label>
                    <textarea className="premium-input" rows="2" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                  </div>
                  <div className="col-12"><button type="submit" className="btn-dynamic py-2 px-5" style={{ backgroundColor: '#F59E0B' }}>Create Event</button></div>
                </div>
              </form>
            </div>
          )}

          {events.length === 0 ? (
            <div className="premium-card p-5 text-center text-muted">
              <Calendar size={48} className="mb-3 opacity-50"/><h5 className="fw-bold">No events yet</h5>
            </div>
          ) : (
            <div className="row g-4">
              {events.map(event => {
                const color = catColors[event.category] || '#4F46E5';
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={event._id}>
                    <div className="premium-card overflow-hidden h-100" style={{ borderTop: `4px solid ${color}` }}>
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: `${color}15`, color }}>{event.category}</span>
                          <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => deleteEvent(event._id)}><Trash2 size={14}/></button>
                        </div>
                        <h6 className="fw-bold mb-1">{event.title}</h6>
                        {event.description && <p className="text-muted small mb-2">{event.description}</p>}
                        <small className="text-muted">{event.date} {event.time && ` • ${event.time}`}</small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Publish Notice */
        <div className="premium-card p-4" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h5 className="fw-bold mb-3"><Bell size={20} className="text-primary me-2"/>Publish Notice</h5>
          <form onSubmit={publishNotice}>
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label className="form-label fw-bold text-muted small">Title *</label>
                <input className="premium-input" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} required />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-bold text-muted small">Type</label>
                <select className="premium-input" value={noticeType} onChange={e => setNoticeType(e.target.value)}>
                  <option value="notice">Notice</option><option value="important">Important</option><option value="event">Event</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small">Content</label>
                <textarea className="premium-input" rows="3" value={noticeContent} onChange={e => setNoticeContent(e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small">Attachment (optional)</label>
                <input type="file" className="form-control" onChange={e => setNoticeFile(e.target.files[0])} />
              </div>
              <div className="col-12"><button type="submit" className="btn-dynamic py-2 px-5">Publish Notice <Upload size={16}/></button></div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminNotices;

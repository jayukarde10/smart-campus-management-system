import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, MapPin, Clock, Tag } from 'lucide-react';
import API from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', category: 'General' });

  let role = 'student';
  try { role = jwtDecode(localStorage.getItem('token')).role; } catch(e) {}
  const canCreate = role === 'faculty' || role === 'admin';

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const endpoint = role === 'faculty' ? '/faculty/events' : role === 'admin' ? '/admin/events' : '/student/events';
      const res = await API.get(endpoint);
      setEvents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === 'admin' ? '/admin/events' : '/faculty/events';
      await API.post(endpoint, form);
      setMsg('Event created!');
      setForm({ title: '', description: '', date: '', time: '', location: '', category: 'General' });
      setShowForm(false);
      fetchEvents();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg('Failed to create event.'); }
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = role === 'admin' ? `/admin/events/${id}` : `/faculty/events/${id}`;
      await API.delete(endpoint);
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  const catColors = { General: '#4F46E5', Technical: '#10B981', Cultural: '#EC4899', Sports: '#F59E0B', Academic: '#8B5CF6' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Events</h2>
          <p className="text-muted m-0">{canCreate ? 'Schedule and manage campus events.' : 'Browse upcoming campus events.'}</p>
        </div>
        {canCreate && (
          <button className="btn-dynamic" onClick={() => setShowForm(!showForm)}>
            <Plus size={18}/> {showForm ? 'Cancel' : 'New Event'}
          </button>
        )}
      </div>

      {msg && <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold">{msg}</div>}

      {showForm && (
        <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h5 className="fw-bold mb-3">Create Event</h5>
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Title *</label>
                <input className="premium-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold text-muted small">Date *</label>
                <input type="date" className="premium-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold text-muted small">Time</label>
                <input className="premium-input" placeholder="10:00 AM" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Location</label>
                <input className="premium-input" placeholder="Auditorium" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Category</label>
                <select className="premium-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>General</option><option>Technical</option><option>Cultural</option><option>Sports</option><option>Academic</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold text-muted small">Description</label>
                <textarea className="premium-input" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn-dynamic py-2 px-5">Create Event</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <Calendar size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No events scheduled</h5>
          <p>{canCreate ? 'Click "New Event" to schedule one.' : 'Events will appear here once scheduled.'}</p>
        </div>
      ) : (
        <div className="row g-4">
          {events.map(event => {
            const color = catColors[event.category] || '#4F46E5';
            return (
              <div className="col-12 col-md-6 col-lg-4" key={event._id}>
                <div className="premium-card overflow-hidden h-100" style={{ borderTop: `4px solid ${color}` }}>
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: `${color}15`, color }}>
                        <Tag size={12} className="me-1"/>{event.category}
                      </span>
                      {canCreate && (
                        <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(event._id)}>
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                    <h5 className="fw-bold mb-2">{event.title}</h5>
                    {event.description && <p className="text-muted small mb-3">{event.description}</p>}
                    <div className="d-flex flex-column gap-2 small text-muted">
                      <span><Calendar size={14} className="me-2"/>{event.date}</span>
                      {event.time && <span><Clock size={14} className="me-2"/>{event.time}</span>}
                      {event.location && <span><MapPin size={14} className="me-2"/>{event.location}</span>}
                      {event.createdByName && <small className="text-muted mt-1">By: {event.createdByName}</small>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;

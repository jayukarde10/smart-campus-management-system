import React, { useState, useEffect } from 'react';
import { Bell, Upload, Trash2, FileText, AlertTriangle, Info, Calendar } from 'lucide-react';
import API, { getApiUrl } from '../../services/api';

const Announcements = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', content: '', type: 'notice' });
  const [file, setFile] = useState(null);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const res = await API.get('/faculty/notices');
      setNotices(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('type', form.type);
      if (file) formData.append('file', file);

      await API.post('/faculty/notices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Notice published successfully!');
      setForm({ title: '', content: '', type: 'notice' });
      setFile(null);
      fetchNotices();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to publish notice.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/faculty/notices/${id}`);
      fetchNotices();
    } catch (err) { console.error(err); }
  };

  const typeIcon = (type) => {
    if (type === 'important') return <AlertTriangle size={16} className="text-danger" />;
    if (type === 'event') return <Calendar size={16} className="text-accent" />;
    return <Info size={16} className="text-primary" />;
  };

  const typeBadge = (type) => {
    const colors = { important: 'danger', event: 'warning', notice: 'primary' };
    return <span className={`badge bg-${colors[type] || 'primary'} bg-opacity-10 text-${colors[type] || 'primary'} rounded-pill px-3 py-1`}>{type}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Notices & Announcements</h2>
        <p className="text-muted m-0">Publish notices, events, and important alerts to all students. Upload PDFs too.</p>
      </div>

      {msg && <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold">{msg}</div>}

      <div className="row g-4">
        {/* Create Form */}
        <div className="col-12 col-lg-5">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Bell size={20} className="text-secondary" /> New Announcement
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Title</label>
                <input className="premium-input" placeholder="Notice title..." value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Content</label>
                <textarea className="premium-input" rows="4" placeholder="Write your announcement..."
                  value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Type</label>
                <select className="premium-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="notice">General Notice</option>
                  <option value="event">Event</option>
                  <option value="important">Important Alert</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">Attach PDF (optional)</label>
                <input type="file" className="form-control" accept=".pdf"
                  onChange={e => setFile(e.target.files[0])} />
                {file && <small className="text-muted mt-1 d-block">📄 {file.name}</small>}
              </div>
              <button type="submit" className="btn-dynamic w-100 py-3" style={{backgroundColor:'var(--secondary)'}} disabled={submitting}>
                {submitting ? 'Publishing...' : 'Publish Notice'} {!submitting && <Upload size={18}/>}
              </button>
            </form>
          </div>
        </div>

        {/* Notices List */}
        <div className="col-12 col-lg-7">
          <div className="premium-card overflow-hidden">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <FileText size={20} className="text-primary" /> Published ({notices.length})
              </h5>
            </div>
            {notices.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <Bell size={48} className="mb-3 opacity-50" />
                <p>No notices published yet.</p>
              </div>
            ) : (
              <div className="p-0">
                {notices.map(n => (
                  <div key={n._id} className="p-4 border-bottom d-flex justify-content-between align-items-start">
                    <div className="d-flex gap-3">
                      <div className="mt-1">{typeIcon(n.type)}</div>
                      <div>
                        <h6 className="fw-bold mb-1">{n.title}</h6>
                        {n.content && <p className="text-muted small mb-2">{n.content}</p>}
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                          {typeBadge(n.type)}
                          <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                          {n.fileUrl && (
                            <a href={`${getApiUrl()}${n.fileUrl}`} target="_blank" rel="noreferrer"
                              className="badge bg-light text-primary border d-flex align-items-center gap-1 text-decoration-none">
                              <FileText size={12}/> {n.fileName || 'Download PDF'}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(n._id)}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;

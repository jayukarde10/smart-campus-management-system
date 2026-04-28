import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Calendar, Info, FileText, Download } from 'lucide-react';
import API from '../../services/api';

const Notifications = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/student/notices');
        setNotices(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  const filtered = filter === 'all' ? notices : notices.filter(n => n.type === filter);

  const typeConfig = {
    important: { icon: <AlertTriangle size={18} />, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Important' },
    event: { icon: <Calendar size={18} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Event' },
    notice: { icon: <Info size={18} />, color: '#4F46E5', bg: 'rgba(79,70,229,0.1)', label: 'Notice' }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Notices & Alerts</h2>
        <p className="text-muted m-0">Important notices, events, and announcements from faculty.</p>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'All', count: notices.length },
          { key: 'important', label: 'Important', count: notices.filter(n => n.type === 'important').length },
          { key: 'event', label: 'Events', count: notices.filter(n => n.type === 'event').length },
          { key: 'notice', label: 'General', count: notices.filter(n => n.type === 'notice').length },
        ].map(tab => (
          <button key={tab.key}
            className={`btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 ${filter === tab.key ? 'btn-primary text-white' : 'btn-light border text-muted'}`}
            style={filter === tab.key ? { backgroundColor: 'var(--primary)' } : {}}
            onClick={() => setFilter(tab.key)}>
            {tab.label}
            <span className={`badge ${filter === tab.key ? 'bg-white text-primary' : 'bg-primary bg-opacity-10 text-primary'} rounded-pill`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <Bell size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No notifications</h5>
          <p>No {filter === 'all' ? '' : filter} notices at the moment.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(n => {
            const config = typeConfig[n.type] || typeConfig.notice;
            return (
              <div key={n._id} className="premium-card p-4 d-flex gap-3"
                   style={{ borderLeft: `4px solid ${config.color}` }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style={{ width: '44px', height: '44px', backgroundColor: config.bg, color: config.color }}>
                  {config.icon}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-bold m-0">{n.title}</h6>
                    <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: config.bg, color: config.color }}>
                      {config.label}
                    </span>
                  </div>
                  {n.content && <p className="text-muted small mb-2">{n.content}</p>}
                  <div className="d-flex gap-3 align-items-center flex-wrap">
                    <small className="text-muted">
                      {new Date(n.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </small>
                    {n.createdByName && <small className="text-muted">By: <strong>{n.createdByName}</strong></small>}
                    {n.fileUrl && (
                      <a href={`http://localhost:5000${n.fileUrl}`} target="_blank" rel="noreferrer"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-3">
                        <Download size={14} /> {n.fileName || 'Download PDF'}
                      </a>
                    )}
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

export default Notifications;

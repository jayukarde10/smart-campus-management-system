import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, Calendar } from 'lucide-react';
import API from '../../services/api';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await API.get('/student/notices');
        setNotices(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchNotices();
  }, []);

  const typeConfig = {
    important: { icon: <AlertTriangle size={18}/>, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    event: { icon: <Calendar size={18}/>, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    notice: { icon: <Info size={18}/>, color: '#4F46E5', bg: 'rgba(79,70,229,0.1)' },
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Notice Board</h2>
        <p className="text-muted m-0">Important announcements and updates.</p>
      </div>

      {notices.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <Bell size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No notices available</h5>
          <p className="m-0">Notices will appear here once published by faculty.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {notices.map((n) => {
            const config = typeConfig[n.type] || typeConfig.notice;
            return (
              <div key={n._id} className="premium-card p-4 d-flex gap-3" style={{ borderLeft: `4px solid ${config.color}` }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                     style={{ width: '44px', height: '44px', backgroundColor: config.bg, color: config.color }}>{config.icon}</div>
                <div>
                  <h6 className="fw-bold mb-1">{n.title}</h6>
                  {n.content && <p className="text-muted small mb-2">{n.content}</p>}
                  <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;

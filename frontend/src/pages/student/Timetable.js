import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Download, FileText, Image } from 'lucide-react';
import API, { getApiUrl } from '../../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_COLORS = {
  Monday: '#4F46E5', Tuesday: '#10B981', Wednesday: '#F59E0B',
  Thursday: '#EF4444', Friday: '#8B5CF6', Saturday: '#EC4899'
};

const Timetable = () => {
  const [timetable, setTimetable] = useState({});
  const [ttFiles, setTtFiles] = useState([]); // uploaded timetable files
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ttRes, noticesRes] = await Promise.all([
          API.get('/student/timetable'),
          API.get('/student/notices')
        ]);
        const mapped = {};
        DAYS.forEach(d => { mapped[d] = []; });
        ttRes.data.forEach(e => { mapped[e.day] = e.periods || []; });
        setTimetable(mapped);

        // Filter notices for timetable type
        const ttNotices = noticesRes.data.filter(n => n.type === 'timetable' && n.fileUrl);
        setTtFiles(ttNotices);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hasAny = DAYS.some(d => timetable[d]?.length > 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Weekly Timetable</h2>
        <p className="text-muted m-0">Your class schedule published by faculty.</p>
      </div>

      {/* Uploaded Timetable Files */}
      {ttFiles.length > 0 && (
        <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <Image size={20} className="text-accent"/> Shared Timetable Files
          </h5>
          <div className="d-flex flex-column gap-2">
            {ttFiles.map(f => (
              <div key={f._id} className="d-flex align-items-center gap-3 p-3 border rounded-3 bg-light">
                <FileText size={20} className="text-primary"/>
                <div className="flex-grow-1">
                  <div className="fw-bold" style={{ fontSize: '14px' }}>{f.title}</div>
                  <small className="text-muted">{f.fileName} — {new Date(f.createdAt).toLocaleDateString()}</small>
                </div>
                <a href={`${getApiUrl()}${f.fileUrl}`} target="_blank" rel="noreferrer"
                   className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 fw-bold">
                  <Download size={14}/> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasAny && ttFiles.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <Calendar size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No timetable published yet</h5>
          <p>Faculty hasn't shared the timetable. Check back later.</p>
        </div>
      ) : hasAny && (
        <div className="row g-4">
          {DAYS.map(day => {
            const periods = timetable[day] || [];
            const isToday = day === today;
            const color = DAY_COLORS[day];
            return (
              <div className="col-12 col-md-6" key={day}>
                <div className="premium-card overflow-hidden h-100" style={{ borderTop: `4px solid ${color}`, ...(isToday ? { boxShadow: `0 0 20px ${color}25` } : {}) }}>
                  <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
                      <Calendar size={16} style={{ color }} /> {day}
                      {isToday && <span className="badge bg-primary rounded-pill ms-2">Today</span>}
                    </h6>
                    <span className="text-muted small fw-bold">{periods.length} classes</span>
                  </div>
                  {periods.length === 0 ? (
                    <div className="p-3 text-center text-muted small">No classes</div>
                  ) : (
                    <div className="p-0">
                      {periods.map((p, i) => (
                        <div key={i} className="p-3 d-flex align-items-center gap-3 border-bottom" style={{ borderLeft: `3px solid ${color}` }}>
                          <div className="text-center" style={{ minWidth: '50px' }}>
                            <Clock size={14} className="text-muted mb-1" />
                            <div className="fw-bold small" style={{ color }}>{p.time || '—'}</div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-bold" style={{ fontSize: '14px' }}>{p.subject}</div>
                            <div className="d-flex gap-2 mt-1">
                              <span className={`badge ${p.type === 'Practical' ? 'bg-secondary' : p.type === 'Tutorial' ? 'bg-warning text-dark' : 'bg-primary'} bg-opacity-10 ${p.type === 'Practical' ? 'text-secondary' : p.type === 'Tutorial' ? 'text-warning' : 'text-primary'} rounded-pill px-2 py-1`} style={{ fontSize: '11px' }}>
                                {p.type}
                              </span>
                              {p.room && (
                                <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                                  <BookOpen size={12} /> {p.room}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timetable;

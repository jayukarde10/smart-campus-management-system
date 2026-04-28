import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, ClipboardList, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API from '../../services/api';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  let userName = 'Professor';
  try { const d = jwtDecode(localStorage.getItem('token')); userName = d.name || 'Professor'; } catch(e) {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studRes, marksRes, noticesRes, ttRes] = await Promise.all([
          API.get('/faculty/students'),
          API.get('/faculty/marks'),
          API.get('/faculty/notices'),
          API.get('/faculty/timetable')
        ]);
        setStudents(studRes.data);
        setMarks(marksRes.data);
        setNotices(noticesRes.data);
        setTimetable(ttRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Today's classes from timetable
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayEntry = timetable.find(t => t.day === todayName);
  const todayClasses = todayEntry?.periods || [];

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Faculty Portal</h2>
          <p className="text-muted m-0">Welcome back, {userName}! Here's your daily digest.</p>
        </div>
        <div className="d-none d-md-block text-end">
          <p className="fw-bold m-0 text-primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        {[
          { icon: <Users size={24} className="text-primary" />, label: 'Total Students', value: students.length, color: 'var(--primary)' },
          { icon: <BookOpen size={24} className="text-secondary" />, label: 'Marks Uploaded', value: marks.length, color: 'var(--secondary)' },
          { icon: <Clock size={24} className="text-accent" />, label: 'Classes Today', value: todayClasses.length, color: 'var(--accent)' },
          { icon: <ClipboardList size={24} className="text-danger" />, label: 'Notices Published', value: notices.length, color: 'var(--danger)' }
        ].map((stat, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="premium-card p-4 d-flex align-items-center justify-content-between h-100 border-0 shadow-sm" style={{ borderBottom: `4px solid ${stat.color}` }}>
              <div>
                <p className="text-muted fw-medium mb-1" style={{ fontSize: '13px' }}>{stat.label}</p>
                <h3 className="fw-bold m-0" style={{ color: stat.color }}>{loading ? '...' : stat.value}</h3>
              </div>
              <div className="p-3 rounded-circle" style={{ backgroundColor: `${stat.color}15` }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Quick Actions + Today's Schedule */}
        <div className="col-12 col-lg-8">
          <div className="premium-card mb-4">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold m-0 text-text-main">Quick Actions</h5>
            </div>
            <div className="p-4 d-flex flex-wrap gap-3">
              <button className="btn-dynamic" onClick={() => navigate('/faculty/attendance')}>
                <CheckCircle size={18} /> Take Attendance
              </button>
              <button className="btn btn-outline-primary fw-bold" style={{ borderRadius: '8px' }} onClick={() => navigate('/faculty/marks')}>
                <ClipboardList size={18} className="me-2" /> Upload Marks
              </button>
              <button className="btn btn-outline-secondary fw-bold" style={{ borderRadius: '8px' }} onClick={() => navigate('/faculty/announcements')}>
                New Announcement
              </button>
            </div>
          </div>

          <div className="premium-card border-0 shadow-sm">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
               <h5 className="fw-bold m-0 text-text-main d-flex align-items-center gap-2">
                 <Clock size={20} className="text-primary" /> Today's Schedule ({todayName})
               </h5>
            </div>
            {todayClasses.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <Clock size={40} className="mb-3 opacity-50" />
                <p className="m-0">{loading ? 'Loading...' : 'No classes scheduled for today. Manage your timetable to add classes.'}</p>
              </div>
            ) : (
              <div className="table-responsive p-0">
                <table className="table table-hover m-0" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 px-4 fw-bold text-muted border-0">Time</th>
                      <th className="py-3 px-4 fw-bold text-muted border-0">Subject</th>
                      <th className="py-3 px-4 fw-bold text-muted border-0">Room/Lab</th>
                      <th className="py-3 px-4 fw-bold text-muted border-0">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayClasses.map((cls, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 align-middle fw-medium">{cls.time || '—'}</td>
                        <td className="py-3 px-4 align-middle fw-bold">{cls.subject}</td>
                        <td className="py-3 px-4 align-middle text-muted">{cls.room || '—'}</td>
                        <td className="py-3 px-4 align-middle">
                          <span className={`badge ${cls.type === 'Practical' ? 'bg-secondary' : 'bg-primary'} opacity-75`}>
                            {cls.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-12 col-lg-4">
          <div className="premium-card h-100">
            <div className="p-4 border-bottom bg-gradient-primary">
              <h5 className="fw-bold m-0 text-white">Recent Activity</h5>
            </div>
            {marks.length === 0 && notices.length === 0 ? (
              <div className="p-4 text-center text-muted d-flex flex-column justify-content-center h-100 w-100 align-items-center">
                <ClipboardList size={40} className="mb-3 opacity-50" />
                <p className="m-0">{loading ? 'Loading...' : 'No recent activity. Upload marks or publish notices to see them here.'}</p>
              </div>
            ) : (
              <div className="p-0">
                {marks.slice(0, 3).map((m, i) => (
                  <div key={m._id || i} className="p-3 border-bottom d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-2"><BookOpen size={16} className="text-primary" /></div>
                    <div>
                      <p className="fw-bold mb-0" style={{ fontSize: '13px' }}>Uploaded marks for {m.studentName}</p>
                      <small className="text-muted">{m.subject} — {m.marks}/{m.totalMarks}</small>
                    </div>
                  </div>
                ))}
                {notices.slice(0, 3).map((n, i) => (
                  <div key={n._id || i} className="p-3 border-bottom d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-accent bg-opacity-10 p-2"><ClipboardList size={16} className="text-accent" /></div>
                    <div>
                      <p className="fw-bold mb-0" style={{ fontSize: '13px' }}>{n.title}</p>
                      <small className="text-muted">{new Date(n.createdAt).toLocaleDateString()}</small>
                    </div>
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

export default FacultyDashboard;

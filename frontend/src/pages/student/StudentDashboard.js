import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Award, FileText, CheckCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  let userName = 'Student';
  try { const d = jwtDecode(localStorage.getItem('token')); userName = d.name || 'Student'; } catch(e) {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marksRes, noticesRes, ttRes] = await Promise.all([
          API.get('/student/marks'),
          API.get('/student/notices'),
          API.get('/student/timetable')
        ]);
        setMarks(marksRes.data);
        setNotices(noticesRes.data);
        setTimetable(ttRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Calculate stats from real data
  const totalExams = marks.length;
  const totalMarksObtained = marks.reduce((a, m) => a + m.marks, 0);
  const totalMarksPossible = marks.reduce((a, m) => a + m.totalMarks, 0);
  const avgPercent = totalMarksPossible > 0 ? Math.round(totalMarksObtained / totalMarksPossible * 100) : 0;
  const subjects = [...new Set(marks.map(m => m.subject))].length;

  // Get today's classes from timetable
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayEntry = timetable.find(t => t.day === todayName);
  const todayClasses = todayEntry?.periods || [];

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Student Portal</h2>
          <p className="text-muted m-0">Welcome back, {userName}! Here's your overview for today.</p>
        </div>
        <div className="d-none d-md-block text-end">
          <p className="fw-bold m-0 text-primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        {[
          { icon: <FileText size={24} className="text-primary" />, label: 'Exams Graded', value: totalExams || '—', color: 'var(--primary)' },
          { icon: <Award size={24} className="text-secondary" />, label: 'Average Score', value: totalExams > 0 ? `${avgPercent}%` : '—', color: 'var(--secondary)' },
          { icon: <BookOpen size={24} className="text-accent" />, label: 'Subjects', value: subjects || '—', color: 'var(--accent)' },
          { icon: <Calendar size={24} className="text-danger" />, label: 'Classes Today', value: todayClasses.length, color: 'var(--danger)' },
        ].map((stat, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="premium-card p-4 d-flex align-items-center justify-content-between h-100 border-0 shadow-sm">
              <div>
                <p className="text-muted fw-medium mb-1" style={{ fontSize: '13px' }}>{stat.label}</p>
                <h3 className="fw-bold m-0" style={{ color: stat.color }}>{stat.value}</h3>
              </div>
              <div className="p-3 rounded-circle" style={{ backgroundColor: `${stat.color}15` }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Today's Schedule */}
        <div className="col-12 col-lg-8">
          <div className="premium-card h-100">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <Clock size={20} className="text-primary" /> Today's Classes ({todayName})
              </h5>
              <button className="btn btn-sm btn-light border" onClick={() => navigate('/student/timetable')}>View Full</button>
            </div>
            <div className="p-4">
              {todayClasses.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <Calendar size={40} className="mb-3 opacity-50" />
                  <p className="m-0">{loading ? 'Loading...' : 'No classes scheduled for today.'}</p>
                </div>
              ) : (
                <div className="position-relative ps-4" style={{ borderLeft: '2px dashed var(--border-color)' }}>
                  {todayClasses.map((cls, i) => (
                    <div className="mb-4 position-relative" key={i}>
                      <div className="position-absolute rounded-circle bg-primary" style={{ width: '12px', height: '12px', left: '-31px', top: '5px' }}></div>
                      <p className="text-primary fw-bold mb-1" style={{ fontSize: '13px' }}>{cls.time || 'TBD'}</p>
                      <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">{cls.subject}</h6>
                          <span className="badge bg-secondary opacity-75">{cls.type}</span>
                        </div>
                        <div className="text-end text-muted">
                          {cls.room && <small className="d-block fw-bold"><BookOpen size={14} className="me-1" />{cls.room}</small>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Notices */}
        <div className="col-12 col-lg-4">
          <div className="premium-card h-100">
            <div className="p-4 border-bottom bg-gradient-primary">
              <h5 className="fw-bold m-0 text-white">Recent Notices</h5>
            </div>
            <div className="p-0">
              {notices.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <Bell size={32} className="mb-2 opacity-50" />
                  <p className="m-0 small">{loading ? 'Loading...' : 'No notices yet.'}</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {notices.slice(0, 4).map((notice, i) => (
                    <li className="list-group-item p-3 border-bottom d-flex align-items-start gap-3" key={notice._id || i}>
                      <div className="bg-light p-2 rounded text-center" style={{ minWidth: '50px' }}>
                        <small className="fw-bold text-primary d-block">{new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short' })}</small>
                        <h5 className="fw-bold m-0">{new Date(notice.createdAt).getDate()}</h5>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>{notice.title}</h6>
                        <small className="text-muted border rounded px-2 py-1">{notice.type}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="p-3 text-center border-top">
                <button className="btn btn-link text-primary text-decoration-none fw-bold" style={{ fontSize: '14px' }} onClick={() => navigate('/student/notifications')}>
                  View All Notices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

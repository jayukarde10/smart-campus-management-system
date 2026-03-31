import React from 'react';
import { BookOpen, Calendar, Clock, Award, FileText, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Student Portal</h2>
          <p className="text-muted m-0">Welcome back, here's your overview for today.</p>
        </div>
        <div className="d-none d-md-block text-end">
          <p className="fw-bold m-0 text-primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        {[
          { icon: <CheckCircle size={24} className="text-secondary" />, label: 'Overall Attendance', value: '86%', color: 'var(--secondary)' },
          { icon: <Award size={24} className="text-primary" />, label: 'Current CGPA', value: '8.4', color: 'var(--primary)' },
          { icon: <Calendar size={24} className="text-accent" />, label: 'Pending Assignments', value: '3', color: 'var(--accent)' },
          { icon: <FileText size={24} className="text-danger" />, label: 'Fee Dues', value: '$0', color: 'var(--danger)' }
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
                <Clock size={20} className="text-primary" /> Today's Classes
              </h5>
              <button className="btn btn-sm btn-light border">View Full</button>
            </div>
            <div className="p-4">
              <div className="position-relative ps-4" style={{ borderLeft: '2px dashed var(--border-color)' }}>
                {[
                  { time: '09:00 AM', name: 'Data Structures', room: 'Lab 3', type: 'Practical' },
                  { time: '11:30 AM', name: 'Software Engineering', room: 'Room 402', type: 'Lecture' },
                  { time: '02:00 PM', name: 'Database Systems', room: 'Room 305', type: 'Lecture' }
                ].map((cls, i) => (
                  <div className="mb-4 position-relative" key={i}>
                    <div className="position-absolute rounded-circle bg-primary" style={{ width: '12px', height: '12px', left: '-31px', top: '5px' }}></div>
                    <p className="text-primary fw-bold mb-1" style={{ fontSize: '13px' }}>{cls.time}</p>
                    <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-1">{cls.name}</h6>
                        <span className="badge bg-secondary opacity-75">{cls.type}</span>
                      </div>
                      <div className="text-end text-muted">
                        <small className="d-block fw-bold"><BookOpen size={14} className="me-1" />{cls.room}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notice Board */}
        <div className="col-12 col-lg-4">
          <div className="premium-card h-100">
            <div className="p-4 border-bottom bg-gradient-primary">
              <h5 className="fw-bold m-0 text-white">Notice Board</h5>
            </div>
            <div className="p-0">
              <ul className="list-group list-group-flush">
                {[
                  { title: 'Mid-term Exams Rescheduled', date: 'Oct 12', tag: 'Important' },
                  { title: 'Tech Symposium Registration Open', date: 'Oct 10', tag: 'Event' },
                  { title: 'Holiday List Updated', date: 'Oct 05', tag: 'General' },
                ].map((notice, i) => (
                  <li className="list-group-item p-4 border-bottom-0 border-bottom d-flex align-items-start gap-3 hover-bg-light" key={i}>
                    <div className="bg-light p-2 rounded text-center" style={{ minWidth: '55px' }}>
                      <small className="fw-bold text-primary d-block">{notice.date.split(' ')[0]}</small>
                      <h5 className="fw-bold m-0 text-text-main">{notice.date.split(' ')[1]}</h5>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{notice.title}</h6>
                      <small className="text-muted border rounded px-2 py-1">{notice.tag}</small>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-3 text-center border-top">
                <a href="#" className="text-primary text-decoration-none fw-bold" style={{ fontSize: '14px' }}>View All Announcements</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

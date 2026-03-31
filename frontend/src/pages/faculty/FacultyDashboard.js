import React from 'react';
import { Users, BookOpen, Clock, Presentation, ClipboardList, CheckCircle } from 'lucide-react';

const FacultyDashboard = () => {
  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Faculty Portal</h2>
          <p className="text-muted m-0">Welcome back, Professor! Here's your daily digest.</p>
        </div>
        <div className="d-none d-md-block text-end">
          <p className="fw-bold m-0 text-primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        {[
          { icon: <Users size={24} className="text-primary" />, label: 'Total Students', value: '145', color: 'var(--primary)' },
          { icon: <BookOpen size={24} className="text-secondary" />, label: 'Assigned Classes', value: '4', color: 'var(--secondary)' },
          { icon: <Presentation size={24} className="text-accent" />, label: 'Classes Today', value: '2', color: 'var(--accent)' },
          { icon: <ClipboardList size={24} className="text-danger" />, label: 'Exams to Grade', value: '32', color: 'var(--danger)' }
        ].map((stat, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="premium-card p-4 d-flex align-items-center justify-content-between h-100 border-0 shadow-sm" style={{ borderBottom: `4px solid ${stat.color}` }}>
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
        {/* Quick Actions */}
        <div className="col-12 col-lg-8">
          <div className="premium-card mb-4">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold m-0 text-text-main">Quick Actions</h5>
            </div>
            <div className="p-4 d-flex flex-wrap gap-3">
              <button className="btn-dynamic">
                <CheckCircle size={18} /> Take Attendance
              </button>
              <button className="btn btn-outline-primary fw-bold" style={{ borderRadius: '8px' }}>
                <ClipboardList size={18} className="me-2" /> Upload Marks
              </button>
              <button className="btn btn-outline-secondary fw-bold" style={{ borderRadius: '8px' }}>
                New Announcement
              </button>
            </div>
          </div>

          <div className="premium-card border-0 shadow-sm">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
               <h5 className="fw-bold m-0 text-text-main d-flex align-items-center gap-2">
                 <Clock size={20} className="text-primary" /> Today's Teaching Schedule
               </h5>
            </div>
            <div className="table-responsive p-0">
              <table className="table table-hover m-0" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4 fw-bold text-muted border-0">Time</th>
                    <th className="py-3 px-4 fw-bold text-muted border-0">Subject</th>
                    <th className="py-3 px-4 fw-bold text-muted border-0">Room/Lab</th>
                    <th className="py-3 px-4 fw-bold text-muted border-0">Type</th>
                    <th className="py-3 px-4 fw-bold text-muted border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: '09:00 AM - 11:00 AM', subject: 'Data Structures', room: 'Lab 3', type: 'Practical' },
                    { time: '11:30 AM - 12:30 PM', subject: 'Software Engineering', room: 'Room 402', type: 'Lecture' },
                  ].map((cls, idx) => (
                    <tr key={idx} style={{ cursor: 'pointer' }}>
                      <td className="py-3 px-4 align-middle fw-medium">{cls.time}</td>
                      <td className="py-3 px-4 align-middle fw-bold">{cls.subject}</td>
                      <td className="py-3 px-4 align-middle text-muted">{cls.room}</td>
                      <td className="py-3 px-4 align-middle">
                        <span className={`badge ${cls.type === 'Practical' ? 'bg-secondary' : 'bg-primary'} opacity-75`}>
                          {cls.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <button className="btn btn-sm btn-outline-primary fw-bold px-3">Start</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="col-12 col-lg-4">
          <div className="premium-card h-100">
            <div className="p-4 border-bottom bg-gradient-primary">
              <h5 className="fw-bold m-0 text-white">Recent Activity</h5>
            </div>
            <div className="p-4 text-center text-muted d-flex flex-column justify-content-center h-100 w-100 align-items-center">
               <ClipboardList size={40} className="mb-3 opacity-50" />
               <p className="m-0">No new student submissions or questions in the last 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

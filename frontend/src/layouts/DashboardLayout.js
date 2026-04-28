import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { 
  LayoutDashboard, Users, BookOpen, Calendar, 
  CreditCard, Bell, MessageSquare, Settings, 
  LogOut, Menu, X, FileText, ClipboardList, TrendingUp, CheckSquare, QrCode,
  Shield, UserCheck, Database, Lock
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  let role = 'student';
  let userName = '';
  try {
    const decoded = jwtDecode(token);
    role = decoded.role || 'student';
    userName = decoded.name || '';
  } catch (e) {}

  const studentSections = [
    {
      title: 'View Features',
      links: [
        { path: '/student/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard Overview' },
        { path: '/student/attendance', icon: <ClipboardList size={18} />, label: 'View Attendance' },
        { path: '/student/marks', icon: <FileText size={18} />, label: 'Marks / Results' },
        { path: '/student/timetable', icon: <Calendar size={18} />, label: 'Timetable' },
        { path: '/student/fees', icon: <CreditCard size={18} />, label: 'Fee Status' },
        { path: '/student/notifications', icon: <Bell size={18} />, label: 'Notices & Alerts' },
      ]
    },
    {
      title: 'Analytics & Tasks',
      links: [
        { path: '/student/analytics', icon: <TrendingUp size={18} />, label: 'Performance Graphs' },
        { path: '/student/tasks', icon: <CheckSquare size={18} />, label: 'Personal Tracker' },
      ]
    },
    {
      title: 'Actions',
      links: [
        { path: '/student/events', icon: <BookOpen size={18} />, label: 'Events & Registration' },
        { path: '/student/chat', icon: <MessageSquare size={18} />, label: 'Chat with Faculty' },
      ]
    }
  ];

  const facultySections = [
    {
      title: 'Core Management',
      links: [
        { path: '/faculty/dashboard', icon: <LayoutDashboard size={18} />, label: 'Main Control Panel' },
        { path: '/faculty/students', icon: <Users size={18} />, label: 'Student Management' },
        { path: '/faculty/timetable', icon: <Calendar size={18} />, label: 'Timetable Management' },
        { path: '/faculty/attendance', icon: <ClipboardList size={18} />, label: 'Attendance Management' },
        { path: '/faculty/marks', icon: <FileText size={18} />, label: 'Marks Management' },
      ]
    },
    {
      title: 'Advanced Modules',
      links: [
        { path: '/faculty/announcements', icon: <Bell size={18} />, label: 'Notices & Uploads' },
        { path: '/faculty/events', icon: <QrCode size={18} />, label: 'Event Management (QR)' },
        { path: '/faculty/analytics', icon: <TrendingUp size={18} />, label: 'Department Analytics' },
        { path: '/faculty/communication', icon: <MessageSquare size={18} />, label: 'Communication Suite' },
      ]
    }
  ];

  const adminSections = [
    {
      title: 'Administration',
      links: [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard Overview' },
        { path: '/admin/faculty-approvals', icon: <UserCheck size={18} />, label: 'Faculty Approvals' },
        { path: '/admin/users', icon: <Users size={18} />, label: 'All Users' },
      ]
    },
    {
      title: 'Management',
      links: [
        { path: '/admin/fees', icon: <CreditCard size={18} />, label: 'Fees Management' },
        { path: '/admin/events', icon: <Calendar size={18} />, label: 'Events & Notices' },
        { path: '/admin/settings', icon: <Settings size={18} />, label: 'System Settings' },
      ]
    }
  ];

  const sections = role === 'admin' ? adminSections : role === 'faculty' ? facultySections : studentSections;

  const getThemeColor = () => {
    if (role === 'admin') return '#F59E0B';
    if (role === 'faculty') return 'var(--secondary)';
    return 'var(--primary)';
  };

  const getRoleLabel = () => {
    if (role === 'admin') return 'Administrator';
    if (role === 'faculty') return 'Professor';
    return 'Student';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNotificationClick = () => {
    if (role === 'student') {
      navigate('/student/notifications');
    } else if (role === 'faculty') {
      navigate('/faculty/announcements');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside 
        className="glass-panel"
        style={{
          width: sidebarOpen ? '280px' : '0',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'var(--transition)',
          position: 'relative',
          zIndex: 40,
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          borderRadius: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="p-4 d-flex align-items-center justify-content-between border-bottom">
          <h4 className="m-0 fw-bold" style={{ whiteSpace: 'nowrap', color: getThemeColor() }}>
            {role === 'admin' ? '🛡️ Admin Panel' : 'Smart Campus'}
          </h4>
        </div>
        
        <div className="p-3 flex-grow-1 overflow-auto custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-4">
              <small className="text-muted fw-bold d-block mb-2 px-2 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                {section.title}
              </small>
              <ul className="nav flex-column gap-1">
                {section.links.map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <li className="nav-item" key={link.path}>
                      <Link 
                        to={link.path}
                        className="nav-link rounded d-flex align-items-center gap-3"
                        style={{
                          background: isActive ? getThemeColor() : 'transparent',
                          color: isActive ? 'white' : 'var(--text-muted)',
                          transition: 'var(--transition)',
                          fontWeight: isActive ? 600 : 500,
                          padding: '10px 16px',
                          fontSize: '14px'
                        }}
                      >
                        {link.icon}
                        <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-3 border-top">
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <button 
                onClick={() => navigate(`/${role}/profile`)}
                className="nav-link rounded border-0 bg-transparent text-muted w-100 text-start d-flex align-items-center gap-3"
                style={{ padding: '10px 16px', fontWeight: 500, fontSize: '14px' }}
              >
                <Settings size={18} />
                Update Profile
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={handleLogout}
                className="nav-link rounded border-0 w-100 text-start d-flex align-items-center gap-3 text-danger"
                style={{ padding: '10px 16px', fontWeight: 500, fontSize: '14px', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content d-flex flex-column p-0">
        {/* Top Navbar */}
        <header 
          className="glass-panel d-flex align-items-center justify-content-between px-4"
          style={{ 
            height: '70px', 
            borderRadius: 0, 
            borderTop: 'none', 
            borderRight: 'none', 
            borderLeft: 'none',
            zIndex: 30
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-light border-0 p-2 shadow-sm rounded-circle d-flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h5 className="m-0 fw-bold text-text-main d-none d-sm-block">
              {location.pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h5>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-light border-0 p-2 shadow-sm rounded-circle position-relative d-flex"
              onClick={handleNotificationClick}
              title="Notifications"
            >
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>
            <div className="d-flex align-items-center gap-2 ms-2">
              <div 
                className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '40px', height: '40px', backgroundColor: getThemeColor() }}
              >
                {userName ? userName.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
              </div>
              <div className="d-none d-md-block">
                <div className="fw-bold" style={{ fontSize: '14px', lineHeight: '1.2' }}>
                  {userName || getRoleLabel()}
                </div>
                <div className="text-uppercase" style={{ fontSize: '11px', color: getThemeColor() }}>{role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-grow-1 p-4 overflow-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

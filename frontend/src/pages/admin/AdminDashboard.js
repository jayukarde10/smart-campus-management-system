import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Shield, Clock, CheckCircle, XCircle, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import API from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStudents: 0, totalFaculty: 0, pendingFaculty: 0 });
  const [pendingFaculty, setPendingFaculty] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredList, setFilteredList] = useState(null); // { title, users }
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/faculty/pending'),
        API.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setPendingFaculty(pendingRes.data);
      setAllUsers(usersRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id, name) => {
    try {
      await API.put(`/admin/faculty/${id}/approve`);
      setActionMsg(`✅ ${name} approved.`);
      fetchData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch { setActionMsg('❌ Failed.'); }
  };

  const handleReject = async (id, name) => {
    try {
      await API.put(`/admin/faculty/${id}/reject`);
      setActionMsg(`🚫 ${name} rejected.`);
      fetchData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch { setActionMsg('❌ Failed.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/faculty/${id}`);
      setActionMsg('🗑️ Deleted.');
      fetchData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch { setActionMsg('❌ Failed.'); }
  };

  // Clickable stats — show filtered user lists
  const showFilteredUsers = async (type) => {
    try {
      if (type === 'total') {
        setFilteredList({ title: 'All Users', users: allUsers });
      } else if (type === 'students') {
        const res = await API.get('/admin/users/students');
        setFilteredList({ title: 'All Students', users: res.data });
      } else if (type === 'faculty') {
        const res = await API.get('/admin/users/faculty');
        setFilteredList({ title: 'All Faculty', users: res.data });
      } else if (type === 'pending') {
        setFilteredList({ title: 'Pending Approvals', users: pendingFaculty });
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Administrator Panel</h2>
          <p className="text-muted m-0">Full system control — manage users, fees, and events.</p>
        </div>
      </div>

      {actionMsg && <div className="alert alert-info py-2 px-4 rounded-3 mb-4 fw-bold" style={{ borderLeft: '4px solid #F59E0B' }}>{actionMsg}</div>}

      {/* Clickable Stats */}
      <div className="row g-4 mb-4">
        {[
          { icon: <Users size={24} className="text-primary" />, label: 'Total Users', value: stats.totalUsers, color: 'var(--primary)', type: 'total' },
          { icon: <GraduationCap size={24} style={{ color: '#10B981' }} />, label: 'Students', value: stats.totalStudents, color: '#10B981', type: 'students' },
          { icon: <Shield size={24} style={{ color: '#F59E0B' }} />, label: 'Faculty', value: stats.totalFaculty, color: '#F59E0B', type: 'faculty' },
          { icon: <Clock size={24} className="text-danger" />, label: 'Pending', value: stats.pendingFaculty, color: 'var(--danger)', type: 'pending' }
        ].map((stat, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <div className="premium-card p-4 d-flex align-items-center justify-content-between h-100 border-0 shadow-sm"
                 style={{ borderBottom: `4px solid ${stat.color}`, cursor: 'pointer' }}
                 onClick={() => showFilteredUsers(stat.type)}>
              <div>
                <p className="text-muted fw-medium mb-1" style={{ fontSize: '13px' }}>{stat.label}</p>
                <h3 className="fw-bold m-0" style={{ color: stat.color }}>{stat.value}</h3>
              </div>
              <div className="p-3 rounded-circle" style={{ backgroundColor: `${stat.color}15` }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtered User List (shown when a stat is clicked) */}
      {filteredList && (
        <div className="premium-card overflow-hidden mb-4 animate-fade-in">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold m-0">{filteredList.title} ({filteredList.users.length})</h5>
            <button className="btn btn-sm btn-light border fw-bold" onClick={() => setFilteredList(null)}>✕ Close</button>
          </div>
          {filteredList.users.length === 0 ? (
            <div className="p-4 text-center text-muted">No users found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="py-3 px-3 fw-bold border-0">#</th>
                    <th className="py-3 px-3 fw-bold border-0">Name</th>
                    <th className="py-3 px-3 fw-bold border-0">Email</th>
                    <th className="py-3 px-3 fw-bold border-0">Role</th>
                    <th className="py-3 px-3 fw-bold border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.users.map((u, i) => (
                    <tr key={u._id}>
                      <td className="px-3 text-muted">{i+1}</td>
                      <td className="px-3 fw-bold">{u.name}</td>
                      <td className="px-3 text-muted small">{u.email}</td>
                      <td className="px-3"><span className={`badge rounded-pill px-3 py-1 ${u.role === 'admin' ? 'bg-warning text-dark' : u.role === 'faculty' ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'}`}>{u.role}</span></td>
                      <td className="px-3"><span className={`badge rounded-pill px-3 py-1 ${u.status === 'approved' ? 'bg-success bg-opacity-10 text-success' : u.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="premium-card overflow-hidden">
        <div className="d-flex border-bottom bg-light">
          {[
            { key: 'overview', label: `Pending Approvals (${pendingFaculty.length})`, icon: <AlertTriangle size={16} /> },
            { key: 'users', label: `All Users (${allUsers.length})`, icon: <Users size={16} /> }
          ].map(tab => (
            <button key={tab.key}
              className={`flex-1 py-3 px-4 fw-bold border-0 bg-transparent d-flex align-items-center justify-content-center gap-2 w-50 ${activeTab === tab.key ? 'border-bottom border-3' : 'text-muted'}`}
              style={{ borderColor: activeTab === tab.key ? '#F59E0B' : 'transparent', color: activeTab === tab.key ? '#F59E0B' : '' }}
              onClick={() => setActiveTab(tab.key)}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === 'overview' ? (
            pendingFaculty.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <UserCheck size={48} className="mb-3 opacity-50" />
                <h5 className="fw-bold">No Pending Approvals</h5>
              </div>
            ) : (
              <div className="row g-4">
                {pendingFaculty.map(f => (
                  <div className="col-12 col-md-6" key={f._id}>
                    <div className="p-4 border rounded-3 bg-light d-flex justify-content-between align-items-start" style={{ borderLeft: '4px solid #F59E0B' }}>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: '40px', height: '40px', backgroundColor: '#F59E0B' }}>
                            {f.name?.charAt(0).toUpperCase()}
                          </div>
                          <div><h6 className="fw-bold mb-0">{f.name}</h6><small className="text-muted">{f.email}</small></div>
                        </div>
                        <span className="badge bg-warning text-dark px-3 py-1">Pending</span>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-success btn-sm d-flex align-items-center gap-1 fw-bold px-3" onClick={() => handleApprove(f._id, f.name)}><CheckCircle size={14}/> Approve</button>
                        <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 fw-bold px-3" onClick={() => handleReject(f._id, f.name)}><XCircle size={14}/> Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="py-3 px-3 fw-bold border-0">User</th>
                    <th className="py-3 px-3 fw-bold border-0">Role</th>
                    <th className="py-3 px-3 fw-bold border-0">Status</th>
                    <th className="py-3 px-3 fw-bold border-0">Joined</th>
                    <th className="py-3 px-3 fw-bold border-0 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u._id}>
                      <td className="px-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: '36px', height: '36px', fontSize: '14px', backgroundColor: u.role === 'admin' ? '#F59E0B' : u.role === 'faculty' ? '#10B981' : '#4F46E5' }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div><div className="fw-bold" style={{ fontSize: '14px' }}>{u.name}</div><div className="text-muted" style={{ fontSize: '12px' }}>{u.email}</div></div>
                        </div>
                      </td>
                      <td className="px-3"><span className={`badge rounded-pill px-3 py-1 ${u.role === 'admin' ? 'bg-warning text-dark' : u.role === 'faculty' ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'}`}>{u.role}</span></td>
                      <td className="px-3"><span className={`badge rounded-pill px-3 py-1 ${u.status === 'approved' ? 'bg-success bg-opacity-10 text-success' : u.status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>{u.status}</span></td>
                      <td className="px-3 text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 text-end">
                        {u.role !== 'admin' && (
                          <div className="d-flex gap-1 justify-content-end">
                            {u.status === 'pending' && <button className="btn btn-sm btn-success px-2 py-1" onClick={() => handleApprove(u._id, u.name)}><UserCheck size={14}/></button>}
                            <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(u._id)}><UserX size={14}/></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

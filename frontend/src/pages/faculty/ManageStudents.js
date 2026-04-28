import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, Search, Filter, Users } from 'lucide-react';
import API from '../../services/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get('/faculty/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Student Management</h2>
          <p className="text-muted m-0">View all registered students.</p>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
            <Users size={20} className="text-primary" /> Enrolled Students ({students.length})
          </h5>
        </div>

        {/* Search */}
        <div className="p-4 pb-0">
          <div className="position-relative mb-4">
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
            <input type="text" className="premium-input ps-5 w-100" placeholder="Search by name or email..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <Users size={48} className="mb-3 opacity-50" />
            <h5 className="fw-bold">No students registered yet</h5>
            <p className="m-0">Students will appear here once they register and are approved.</p>
          </div>
        ) : (
          <div className="table-responsive p-4 pt-0">
            <table className="table table-hover align-middle">
              <thead className="table-light text-muted">
                <tr>
                  <th className="py-3 px-3 fw-bold border-0">#</th>
                  <th className="py-3 px-3 fw-bold border-0">Name & Email</th>
                  <th className="py-3 px-3 fw-bold border-0">Status</th>
                  <th className="py-3 px-3 fw-bold border-0">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student._id}>
                    <td className="px-3 fw-bold text-muted">{idx + 1}</td>
                    <td className="px-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                             style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{student.name}</div>
                          <div className="text-muted small">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3">
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                        Active
                      </span>
                    </td>
                    <td className="px-3 text-muted small">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && searchTerm && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No students match "{searchTerm}"</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;

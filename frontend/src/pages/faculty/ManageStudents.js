import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Users, Save, X, AlertTriangle } from 'lucide-react';
import API, { getApiUrl } from '../../services/api';

const ManageStudents = () => {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [msg, setMsg]             = useState({ text: '', type: '' });

  // Edit modal state
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm]       = useState({});
  const [saving, setSaving]           = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  useEffect(() => { fetchStudents(); }, []);

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

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  // ── Edit ──────────────────────────────────────────────
  const openEdit = (student) => {
    setEditStudent(student);
    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      department: student.department || '',
      year: student.year || ''
    });
  };

  const closeEdit = () => { setEditStudent(null); setEditForm({}); };

  const handleEditSave = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      showMsg('Name and email are required.', 'danger');
      return;
    }
    setSaving(true);
    try {
      const res = await API.put(`/faculty/students/${editStudent._id}`, editForm);
      setStudents(prev =>
        prev.map(s => s._id === editStudent._id ? { ...s, ...res.data.student } : s)
      );
      closeEdit();
      showMsg('Student updated successfully!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to update student.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await API.delete(`/faculty/students/${deleteTarget._id}`);
      setStudents(prev => prev.filter(s => s._id !== deleteTarget._id));
      setDeleteTarget(null);
      showMsg('Student account deleted.');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to delete student.', 'danger');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Student Management</h2>
          <p className="text-muted m-0">View, edit, and manage registered students.</p>
        </div>
        <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-bold fs-6">
          {students.length} Students
        </span>
      </div>

      {/* Alert */}
      {msg.text && (
        <div className={`alert alert-${msg.type} py-2 px-4 rounded-3 mb-4 fw-bold`}>
          {msg.text}
        </div>
      )}

      <div className="premium-card overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-bottom">
          <div className="position-relative">
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
            <input
              type="text"
              className="premium-input ps-5 w-100"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {students.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <Users size={48} className="mb-3 opacity-50" />
            <h5 className="fw-bold">No students registered yet</h5>
            <p className="m-0">Students will appear here once they register and are approved.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light text-muted">
                <tr>
                  <th className="py-3 px-3 fw-bold border-0">#</th>
                  <th className="py-3 px-3 fw-bold border-0">Name &amp; Email</th>
                  <th className="py-3 px-3 fw-bold border-0">Department</th>
                  <th className="py-3 px-3 fw-bold border-0">Year</th>
                  <th className="py-3 px-3 fw-bold border-0">Joined</th>
                  <th className="py-3 px-3 fw-bold border-0 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student._id}>
                    <td className="px-3 fw-bold text-muted">{idx + 1}</td>
                    <td className="px-3">
                      <div className="d-flex align-items-center gap-2">
                        {student.avatar ? (
                          <img 
                            src={`${getApiUrl()}${student.avatar}`} 
                            alt={student.name} 
                            className="rounded-circle object-fit-cover"
                            style={{ width: '38px', height: '38px', flexShrink: 0 }} 
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '38px', height: '38px', fontSize: '15px', flexShrink: 0 }}
                          >
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="fw-bold">{student.name}</div>
                          <div className="text-muted small">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 text-muted small">{student.department || '—'}</td>
                    <td className="px-3 text-muted small">{student.year || '—'}</td>
                    <td className="px-3 text-muted small">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-3 text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 fw-bold"
                          onClick={() => openEdit(student)}
                          title="Edit student"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 fw-bold"
                          onClick={() => setDeleteTarget(student)}
                          title="Delete student"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && searchTerm && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No students match "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ──────── EDIT MODAL ──────── */}
      {editStudent && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}
          onClick={closeEdit}
        >
          <div
            className="premium-card p-4"
            style={{ width: '100%', maxWidth: '480px', margin: '0 1rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <Edit size={20} className="text-primary" /> Edit Student
              </h5>
              <button className="btn btn-sm btn-outline-secondary rounded-circle p-1" onClick={closeEdit}>
                <X size={18} />
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label fw-bold text-muted small">Full Name *</label>
                <input
                  type="text"
                  className="premium-input w-100"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Student full name"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-muted small">Email Address *</label>
                <input
                  type="email"
                  className="premium-input w-100"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-muted small">Phone</label>
                <input
                  type="text"
                  className="premium-input w-100"
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-muted small">Department</label>
                <input
                  type="text"
                  className="premium-input w-100"
                  value={editForm.department}
                  onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))}
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-muted small">Year / Semester</label>
                <input
                  type="text"
                  className="premium-input w-100"
                  value={editForm.year}
                  onChange={e => setEditForm(f => ({ ...f, year: e.target.value }))}
                  placeholder="e.g. 2nd Year / Sem 4"
                />
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-outline-secondary flex-grow-1 fw-bold" onClick={closeEdit} disabled={saving}>
                Cancel
              </button>
              <button
                className="btn-dynamic flex-grow-1"
                style={{ backgroundColor: 'var(--primary)' }}
                onClick={handleEditSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : <><Save size={16} className="me-1" /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────── DELETE CONFIRM MODAL ──────── */}
      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="premium-card p-4 text-center"
            style={{ width: '100%', maxWidth: '400px', margin: '0 1rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '60px', height: '60px', backgroundColor: 'rgba(239,68,68,0.12)' }}
            >
              <AlertTriangle size={28} className="text-danger" />
            </div>
            <h5 className="fw-bold mb-2">Delete Student Account?</h5>
            <p className="text-muted mb-4">
              You are about to permanently delete <strong>{deleteTarget.name}</strong>'s account.
              This action <strong>cannot be undone</strong>.
            </p>
            <div className="d-flex gap-3">
              <button
                className="btn btn-outline-secondary flex-grow-1 fw-bold"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger flex-grow-1 fw-bold"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : <><Trash2 size={16} className="me-1" /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;

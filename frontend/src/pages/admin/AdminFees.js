import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Edit, CheckCircle } from 'lucide-react';
import API from '../../services/api';

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: '', feeType: '', amount: '', paid: '0', status: 'pending', dueDate: '', semester: 'Current' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [feesRes, studRes] = await Promise.all([
        API.get('/admin/fees'),
        API.get('/admin/students')
      ]);
      setFees(feesRes.data);
      setStudents(studRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const student = students.find(s => s._id === form.studentId);
      await API.post('/admin/fees', {
        ...form,
        studentName: student?.name || '',
        studentEmail: student?.email || ''
      });
      setMsg('Fee assigned!');
      setForm({ studentId: '', feeType: '', amount: '', paid: '0', status: 'pending', dueDate: '', semester: 'Current' });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg('Failed to assign fee.'); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/fees/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleMarkPaid = async (id) => {
    try {
      const fee = fees.find(f => f._id === id);
      await API.put(`/admin/fees/${id}`, { paid: fee.amount, status: 'paid' });
      setMsg('Marked as paid!');
      fetchData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Fees Management</h2>
          <p className="text-muted m-0">Assign and manage fees for individual students.</p>
        </div>
        <button className="btn-dynamic" style={{ backgroundColor: '#F59E0B' }} onClick={() => setShowForm(!showForm)}>
          <Plus size={18}/> {showForm ? 'Cancel' : 'Assign Fee'}
        </button>
      </div>

      {msg && <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold">{msg}</div>}

      {showForm && (
        <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid #F59E0B' }}>
          <h5 className="fw-bold mb-3">Assign Fee to Student</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Student *</label>
                <select className="premium-input" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold text-muted small">Fee Type *</label>
                <select className="premium-input" value={form.feeType} onChange={e => setForm({...form, feeType: e.target.value})} required>
                  <option value="">-- Select --</option>
                  <option>Tuition Fee</option><option>Library Fee</option><option>Lab Fee</option><option>Exam Fee</option><option>Hostel Fee</option><option>Other</option>
                </select>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold text-muted small">Amount (₹) *</label>
                <input type="number" className="premium-input" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required min="1" />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold text-muted small">Paid (₹)</label>
                <input type="number" className="premium-input" value={form.paid} onChange={e => setForm({...form, paid: e.target.value})} min="0" />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold text-muted small">Due Date</label>
                <input type="date" className="premium-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-bold text-muted small">Semester</label>
                <input className="premium-input" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn-dynamic py-2 px-5" style={{ backgroundColor: '#F59E0B' }}>Assign Fee</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="premium-card overflow-hidden">
        <div className="p-4 border-bottom">
          <h5 className="fw-bold m-0"><CreditCard size={20} className="me-2" style={{ color: '#F59E0B' }}/>Assigned Fees ({fees.length})</h5>
        </div>
        {fees.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <CreditCard size={48} className="mb-3 opacity-50" />
            <h5 className="fw-bold">No fees assigned yet</h5>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light text-muted">
                <tr>
                  <th className="py-3 px-3 fw-bold border-0">Student</th>
                  <th className="py-3 px-3 fw-bold border-0">Fee Type</th>
                  <th className="py-3 px-3 fw-bold border-0">Amount</th>
                  <th className="py-3 px-3 fw-bold border-0">Paid</th>
                  <th className="py-3 px-3 fw-bold border-0">Status</th>
                  <th className="py-3 px-3 fw-bold border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id}>
                    <td className="px-3"><div className="fw-bold" style={{fontSize:'14px'}}>{f.studentName}</div><div className="text-muted" style={{fontSize:'12px'}}>{f.studentEmail}</div></td>
                    <td className="px-3 fw-medium">{f.feeType}</td>
                    <td className="px-3 fw-bold">₹{f.amount?.toLocaleString()}</td>
                    <td className="px-3" style={{color: f.paid >= f.amount ? 'var(--secondary)' : 'var(--accent)'}}>₹{f.paid?.toLocaleString()}</td>
                    <td className="px-3">
                      <span className={`badge rounded-pill px-3 py-1 ${f.status === 'paid' ? 'bg-success bg-opacity-10 text-success' : f.status === 'partial' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>{f.status}</span>
                    </td>
                    <td className="px-3 text-end">
                      <div className="d-flex gap-1 justify-content-end">
                        {f.status !== 'paid' && <button className="btn btn-sm btn-success px-2 py-1" title="Mark Paid" onClick={() => handleMarkPaid(f._id)}><CheckCircle size={14}/></button>}
                        <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(f._id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFees;

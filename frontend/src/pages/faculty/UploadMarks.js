import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Upload, Trash2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import API from '../../services/api';

const UploadMarks = () => {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [reportFile, setReportFile] = useState(null);

  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    marks: '',
    totalMarks: '100',
    examType: 'midterm',
    semester: 'Current'
  });
  const [individualFile, setIndividualFile] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await API.get('/faculty/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  }, []);

  const fetchMarks = useCallback(async () => {
    try {
      const res = await API.get('/faculty/marks');
      setMarks(res.data);
    } catch (err) {
      console.error('Failed to fetch marks:', err);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchMarks();
  }, [fetchStudents, fetchMarks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const student = students.find(s => s._id === form.studentId);
      const formData = new FormData();
      formData.append('studentId', form.studentId);
      formData.append('studentName', student?.name || '');
      formData.append('studentEmail', student?.email || '');
      formData.append('subject', form.subject);
      formData.append('marks', form.marks);
      formData.append('totalMarks', form.totalMarks);
      formData.append('examType', form.examType);
      formData.append('semester', form.semester);
      if (individualFile) formData.append('file', individualFile);

      await API.post('/faculty/marks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Marks uploaded successfully!');
      setMsgType('success');
      setForm({ studentId: '', subject: '', marks: '', totalMarks: '100', examType: 'midterm', semester: 'Current' });
      setIndividualFile(null);
      fetchMarks();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to upload marks');
      setMsgType('danger');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/faculty/marks/${id}`);
      setMsg('Marks deleted.');
      setMsgType('success');
      fetchMarks();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to delete.');
      setMsgType('danger');
    }
  };

  const handleSharePdf = async () => {
    if (!reportFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', `Marks Report - ${form.subject || 'All Subjects'}`);
      formData.append('content', 'Student marks report shared by faculty. Please download and review.');
      formData.append('type', 'important');
      formData.append('file', reportFile);

      await API.post('/faculty/notices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('PDF report shared to all students via Notices!');
      setMsgType('success');
      setReportFile(null);
    } catch (err) {
      setMsg('Failed to share report.');
      setMsgType('danger');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Marks Management</h2>
          <p className="text-muted m-0">Upload marks and share PDF reports with students.</p>
        </div>
      </div>

      {msg && (
        <div className={`alert alert-${msgType} py-2 px-4 rounded-3 mb-4 animate-fade-in fw-medium d-flex align-items-center gap-2`}
             style={{ borderLeft: `4px solid var(--${msgType === 'success' ? 'secondary' : 'danger'})` }}>
          {msgType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg}
        </div>
      )}

      <div className="row g-4">
        {/* Upload Form */}
        <div className="col-12 col-lg-5">
          <div className="premium-card p-4 mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Upload size={20} className="text-secondary" /> Upload New Marks
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Select Student</label>
                <select className="premium-input" value={form.studentId} onChange={(e) => setForm({...form, studentId: e.target.value})} required>
                  <option value="">-- Choose Student --</option>
                  {students.length === 0 && <option disabled>No students registered yet</option>}
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                  ))}
                </select>
                {students.length === 0 && (
                  <small className="text-warning d-block mt-1">⚠️ No students found. Students need to register first.</small>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Subject</label>
                <input className="premium-input" placeholder="e.g. Data Structures" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">Marks Obtained</label>
                  <input type="number" className="premium-input" placeholder="85" value={form.marks} onChange={(e) => setForm({...form, marks: e.target.value})} required min="0" />
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">Total Marks</label>
                  <input type="number" className="premium-input" placeholder="100" value={form.totalMarks} onChange={(e) => setForm({...form, totalMarks: e.target.value})} required min="1" />
                </div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">Exam Type</label>
                  <select className="premium-input" value={form.examType} onChange={(e) => setForm({...form, examType: e.target.value})}>
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold text-muted small">Semester</label>
                  <input className="premium-input" placeholder="Sem 5" value={form.semester} onChange={(e) => setForm({...form, semester: e.target.value})} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">Individual Result PDF (optional)</label>
                <input type="file" className="form-control" accept=".pdf" onChange={e => setIndividualFile(e.target.files[0])} />
                {individualFile && <small className="text-muted d-block mt-1">📄 {individualFile.name}</small>}
              </div>
              <button type="submit" className="btn-dynamic w-100 py-3" style={{ backgroundColor: 'var(--secondary)' }} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Marks'}
                {!loading && <Upload size={18} />}
              </button>
            </form>
          </div>

          {/* PDF Report Sharing */}
          <div className="premium-card p-4" style={{ borderLeft: '4px solid var(--accent)' }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Download size={20} className="text-accent" /> Share PDF Report
            </h5>
            <p className="text-muted small mb-3">Upload a PDF marks report to share with all students via the Notices section.</p>
            <input type="file" className="form-control mb-3" accept=".pdf" onChange={e => setReportFile(e.target.files[0])} />
            {reportFile && <small className="text-muted d-block mb-3">📄 {reportFile.name}</small>}
            <button className="btn-dynamic w-100 py-2" style={{ backgroundColor: 'var(--accent)' }} onClick={handleSharePdf} disabled={!reportFile || loading}>
              {loading ? 'Sharing...' : 'Share Report to Students'}
              <FileText size={16} />
            </button>
          </div>
        </div>

        {/* Marks Table */}
        <div className="col-12 col-lg-7">
          <div className="premium-card overflow-hidden">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <FileText size={20} className="text-primary" /> Uploaded Marks ({marks.length})
              </h5>
            </div>
            {marks.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <FileText size={48} className="mb-3 opacity-50" />
                <p className="m-0">No marks uploaded yet. Use the form to upload.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-hover align-middle m-0">
                  <thead className="table-light text-muted sticky-top">
                    <tr>
                      <th className="py-3 px-3 fw-bold border-0">Student</th>
                      <th className="py-3 px-3 fw-bold border-0">Subject</th>
                      <th className="py-3 px-3 fw-bold border-0">Marks</th>
                      <th className="py-3 px-3 fw-bold border-0">Type</th>
                      <th className="py-3 px-3 fw-bold border-0 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m) => (
                      <tr key={m._id}>
                        <td className="px-3">
                          <div className="fw-bold" style={{ fontSize: '14px' }}>{m.studentName}</div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>{m.studentEmail}</div>
                        </td>
                        <td className="px-3 fw-medium">{m.subject}</td>
                        <td className="px-3">
                          <span className="fw-bold" style={{ color: (m.marks / m.totalMarks) >= 0.6 ? 'var(--secondary)' : 'var(--danger)' }}>
                            {m.marks}/{m.totalMarks}
                          </span>
                          <span className="text-muted ms-1" style={{ fontSize: '12px' }}>
                            ({Math.round(m.marks / m.totalMarks * 100)}%)
                          </span>
                        </td>
                        <td className="px-3">
                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 mb-1 d-inline-block">
                            {m.examType}
                          </span>
                          {m.fileUrl && <span className="d-block text-muted small" style={{fontSize:'11px'}}>📎 PDF Attached</span>}
                        </td>
                        <td className="px-3 text-end">
                          <button className="btn btn-sm btn-outline-danger px-2 py-1" onClick={() => handleDelete(m._id)}>
                            <Trash2 size={14} />
                          </button>
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
    </div>
  );
};

export default UploadMarks;

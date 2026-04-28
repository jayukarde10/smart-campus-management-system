import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Save, Clock, Upload } from 'lucide-react';
import API from '../../services/api';

const ManageAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('General');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [attFile, setAttFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get('/faculty/students');
        setStudents(res.data.map(s => ({ ...s, status: 'present' })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStudents();
  }, []);

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => s._id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s));
  };

  const markAll = (status) => setStudents(prev => prev.map(s => ({ ...s, status })));

  const presentCount = students.filter(s => s.status === 'present').length;

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-secondary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Attendance Management</h2>
          <p className="text-muted m-0">Mark and manage daily attendance for your classes.</p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold d-flex align-items-center gap-2">
          <CheckCircle size={18}/> Attendance saved for {selectedDate}!
        </div>
      )}

      {uploadMsg && <div className="alert alert-success py-2 px-4 rounded-3 mb-4 fw-bold">{uploadMsg}</div>}

      {/* Upload Defaulter List / Attendance PDF */}
      <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Upload size={20} className="text-accent" /> Share Attendance PDF / Defaulter List
        </h5>
        <p className="text-muted small mb-3">Upload a PDF of the attendance report or defaulter list. Students will see it in their Notices section.</p>
        <div className="d-flex gap-3 align-items-end flex-wrap">
          <input type="file" className="form-control" style={{ maxWidth: '350px' }}
            accept=".pdf" onChange={e => setAttFile(e.target.files[0])} />
          {attFile && <small className="text-muted">📄 {attFile.name}</small>}
          <button className="btn-dynamic" style={{ backgroundColor: 'var(--accent)' }}
            onClick={async () => {
              if (!attFile) return;
              setUploading(true);
              try {
                const formData = new FormData();
                formData.append('file', attFile);
                formData.append('title', 'Attendance Report - ' + selectedDate);
                await API.post('/faculty/attendance/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setUploadMsg('Attendance PDF shared to students!');
                setAttFile(null);
                setTimeout(() => setUploadMsg(''), 4000);
              } catch { setUploadMsg('Failed to upload.'); }
              finally { setUploading(false); }
            }} disabled={!attFile || uploading}>
            {uploading ? 'Uploading...' : 'Share to Students'} <Upload size={16} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="row g-3 mb-4">
        <div className="col-auto">
          <label className="form-label fw-bold text-muted small">Date</label>
          <input type="date" className="premium-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}/>
        </div>
        <div className="col-auto">
          <label className="form-label fw-bold text-muted small">Class / Subject</label>
          <select className="premium-input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="General">General</option>
          </select>
        </div>
        <div className="col-auto d-flex align-items-end gap-2">
          <button className="btn btn-outline-success fw-bold d-flex align-items-center gap-1" onClick={() => markAll('present')}><CheckCircle size={16}/> All Present</button>
          <button className="btn btn-outline-danger fw-bold d-flex align-items-center gap-1" onClick={() => markAll('absent')}><XCircle size={16}/> All Absent</button>
        </div>
      </div>

      {/* Summary */}
      <div className="row g-4 mb-4">
        <div className="col-4">
          <div className="premium-card p-3 text-center border-0 shadow-sm">
            <p className="text-muted small fw-bold mb-1">Total</p>
            <h4 className="fw-bold m-0 text-primary">{students.length}</h4>
          </div>
        </div>
        <div className="col-4">
          <div className="premium-card p-3 text-center border-0 shadow-sm">
            <p className="text-muted small fw-bold mb-1">Present</p>
            <h4 className="fw-bold m-0 text-success">{presentCount}</h4>
          </div>
        </div>
        <div className="col-4">
          <div className="premium-card p-3 text-center border-0 shadow-sm">
            <p className="text-muted small fw-bold mb-1">Absent</p>
            <h4 className="fw-bold m-0 text-danger">{students.length - presentCount}</h4>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="premium-card overflow-hidden">
        {students.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <Clock size={48} className="mb-3 opacity-50"/>
            <h5 className="fw-bold">No students registered</h5>
            <p>Students will appear here once they register.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="py-3 px-3 fw-bold border-0">#</th>
                    <th className="py-3 px-3 fw-bold border-0">Student</th>
                    <th className="py-3 px-3 fw-bold border-0">Email</th>
                    <th className="py-3 px-3 fw-bold border-0 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s._id} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(s._id)}>
                      <td className="px-3 text-muted">{i + 1}</td>
                      <td className="px-3 fw-bold">{s.name}</td>
                      <td className="px-3 text-muted small">{s.email}</td>
                      <td className="px-3 text-center">
                        <button className={`btn btn-sm rounded-pill px-4 py-1 fw-bold ${s.status === 'present' ? 'btn-success' : 'btn-outline-danger'}`}
                          onClick={(e) => { e.stopPropagation(); toggleStatus(s._id); }}>
                          {s.status === 'present' ? <><CheckCircle size={14} className="me-1"/> Present</> : <><XCircle size={14} className="me-1"/> Absent</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-top d-flex justify-content-end">
              <button className="btn-dynamic py-2 px-5" style={{ backgroundColor: 'var(--secondary)' }} onClick={handleSave}>
                <Save size={18}/> Save Attendance
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageAttendance;

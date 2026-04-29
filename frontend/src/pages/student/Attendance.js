import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, TrendingUp, Download, FileText } from 'lucide-react';
import API, { getApiUrl } from '../../services/api';

const Attendance = () => {
  const [marks, setMarks]           = useState([]);
  const [attFiles, setAttFiles]     = useState([]); // faculty-shared PDFs
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marksRes, noticesRes] = await Promise.all([
          API.get('/student/marks'),
          API.get('/student/notices')
        ]);
        setMarks(marksRes.data);

        // Only attendance-type notices with a file
        const att = noticesRes.data.filter(n => n.type === 'attendance' && n.fileUrl);
        setAttFiles(att);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const subjects = [...new Set(marks.map(m => m.subject))];

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Attendance Record</h2>
          <p className="text-muted m-0">Track your attendance and view faculty-shared reports.</p>
        </div>
      </div>

      {/* Faculty-shared Attendance PDFs */}
      {attFiles.length > 0 && (
        <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <FileText size={20} className="text-accent" /> Shared Attendance Reports
          </h5>
          <p className="text-muted small mb-3">
            Attendance reports and defaulter lists shared by faculty.
          </p>
          <div className="d-flex flex-column gap-2">
            {attFiles.map(f => (
              <div key={f._id} className="d-flex align-items-center gap-3 p-3 border rounded-3 bg-light">
                <FileText size={22} className="text-danger flex-shrink-0" />
                <div className="flex-grow-1">
                  <div className="fw-bold" style={{ fontSize: '14px' }}>{f.title}</div>
                  <small className="text-muted">
                    {f.fileName} — Shared on {new Date(f.createdAt).toLocaleDateString()}
                    {f.createdByName && ` by ${f.createdByName}`}
                  </small>
                </div>
                <a
                  href={`${getApiUrl()}${f.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 fw-bold"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject-based attendance (from marks) */}
      {subjects.length === 0 && attFiles.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <ClipboardList size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No attendance data available</h5>
          <p className="m-0">Attendance records will appear here once faculty marks or uploads reports.</p>
        </div>
      ) : subjects.length > 0 && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-6 col-lg-3">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div>
                  <p className="text-muted fw-medium mb-1 small">Subjects Enrolled</p>
                  <h3 className="fw-bold m-0 text-primary">{subjects.length}</h3>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(79,70,229,0.1)' }}>
                  <TrendingUp size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card overflow-hidden">
            <div className="p-4 border-bottom">
              <h5 className="fw-bold m-0">
                <ClipboardList size={20} className="text-primary me-2" />Your Subjects
              </h5>
            </div>
            <div className="p-4">
              <div className="d-flex flex-column gap-3">
                {subjects.map((subj, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded-3 d-flex align-items-center gap-3"
                    style={{ borderLeft: '4px solid var(--primary)' }}
                  >
                    <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{subj}</h6>
                      <small className="text-muted">Attendance tracking will be enabled by faculty</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;

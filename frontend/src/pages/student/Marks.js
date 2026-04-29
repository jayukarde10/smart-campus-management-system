import React, { useState, useEffect } from 'react';
import { FileText, Award, TrendingUp, Download } from 'lucide-react';
import API, { getApiUrl } from '../../services/api';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [reportFiles, setReportFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarksAndReports = async () => {
      try {
        const [marksRes, noticesRes] = await Promise.all([
          API.get('/student/marks'),
          API.get('/student/notices')
        ]);
        setMarks(marksRes.data);
        
        // Faculty upload Marks Reports as notices of type "important" with "Marks Report" in title
        const reports = noticesRes.data.filter(n => n.type === 'important' && n.fileUrl && n.title.includes('Marks Report'));
        setReportFiles(reports);
        
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchMarksAndReports();
  }, []);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  // Group by subject
  const grouped = {};
  marks.forEach(m => {
    if (!grouped[m.subject]) grouped[m.subject] = [];
    grouped[m.subject].push(m);
  });

  const totalMarks = marks.reduce((a, m) => a + m.marks, 0);
  const totalPossible = marks.reduce((a, m) => a + m.totalMarks, 0);
  const avgPercent = totalPossible > 0 ? Math.round(totalMarks / totalPossible * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Marks & Results</h2>
        <p className="text-muted m-0">View your marks and reports shared by faculty.</p>
      </div>

      {/* Shared PDF Reports */}
      {reportFiles.length > 0 && (
        <div className="premium-card p-4 mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <Download size={20} className="text-accent" /> Shared Marks Reports
          </h5>
          <div className="d-flex flex-column gap-2">
            {reportFiles.map(f => (
              <div key={f._id} className="d-flex align-items-center gap-3 p-3 border rounded-3 bg-light">
                <FileText size={22} className="text-primary flex-shrink-0" />
                <div className="flex-grow-1">
                  <div className="fw-bold" style={{ fontSize: '14px' }}>{f.title}</div>
                  <small className="text-muted">
                    Shared on {new Date(f.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <a
                  href={`${getApiUrl()}${f.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 fw-bold"
                >
                  <Download size={14} /> Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="premium-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-medium mb-1 small">Total Exams</p>
              <h3 className="fw-bold m-0 text-primary">{marks.length}</h3>
            </div>
            <div className="p-3 rounded-circle" style={{backgroundColor:'rgba(79,70,229,0.1)'}}><FileText size={24} className="text-primary"/></div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="premium-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-medium mb-1 small">Average Score</p>
              <h3 className="fw-bold m-0" style={{color: avgPercent >= 60 ? 'var(--secondary)' : 'var(--danger)'}}>{avgPercent}%</h3>
            </div>
            <div className="p-3 rounded-circle" style={{backgroundColor:'rgba(16,185,129,0.1)'}}><TrendingUp size={24} className="text-secondary"/></div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="premium-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted fw-medium mb-1 small">Subjects</p>
              <h3 className="fw-bold m-0 text-accent">{Object.keys(grouped).length}</h3>
            </div>
            <div className="p-3 rounded-circle" style={{backgroundColor:'rgba(245,158,11,0.1)'}}><Award size={24} className="text-accent"/></div>
          </div>
        </div>
      </div>

      {marks.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <FileText size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No individual marks available yet</h5>
          <p>Your faculty hasn't shared any individual exam marks. Check back later.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([subject, subMarks]) => (
          <div className="premium-card mb-4 overflow-hidden" key={subject}>
            <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0">{subject}</h5>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">
                {subMarks.length} exam{subMarks.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="py-3 px-3 fw-bold border-0">Exam Type</th>
                    <th className="py-3 px-3 fw-bold border-0">Marks</th>
                    <th className="py-3 px-3 fw-bold border-0">Percentage</th>
                    <th className="py-3 px-3 fw-bold border-0">Semester</th>
                    <th className="py-3 px-3 fw-bold border-0">Date</th>
                    <th className="py-3 px-3 fw-bold border-0">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {subMarks.map(m => {
                    const pct = Math.round(m.marks / m.totalMarks * 100);
                    return (
                      <tr key={m._id}>
                        <td className="px-3"><span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1">{m.examType}</span></td>
                        <td className="px-3 fw-bold">{m.marks} / {m.totalMarks}</td>
                        <td className="px-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{height:'8px', maxWidth:'120px'}}>
                              <div className="progress-bar" role="progressbar" style={{width:`${pct}%`, backgroundColor: pct >= 60 ? 'var(--secondary)' : 'var(--danger)'}}></div>
                            </div>
                            <span className="fw-bold small" style={{color: pct >= 60 ? 'var(--secondary)' : 'var(--danger)'}}>{pct}%</span>
                          </div>
                        </td>
                        <td className="px-3 text-muted">{m.semester}</td>
                        <td className="px-3 text-muted small">{new Date(m.createdAt).toLocaleDateString()}</td>
                        <td className="px-3">
                          {m.fileUrl ? (
                            <a href={`${getApiUrl()}${m.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 fw-bold" style={{fontSize:'12px'}}>
                              <Download size={12}/> PDF
                            </a>
                          ) : <span className="text-muted small">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Marks;

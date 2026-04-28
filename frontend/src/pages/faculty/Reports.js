import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Users, Download } from 'lucide-react';
import API from '../../services/api';

const Reports = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marksRes, studRes] = await Promise.all([
          API.get('/faculty/marks'),
          API.get('/faculty/students')
        ]);
        setMarks(marksRes.data);
        setStudents(studRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const subjectMap = {};
  marks.forEach(m => {
    if (!subjectMap[m.subject]) subjectMap[m.subject] = { total: 0, max: 0, count: 0, pass: 0 };
    subjectMap[m.subject].total += m.marks;
    subjectMap[m.subject].max += m.totalMarks;
    subjectMap[m.subject].count += 1;
    if ((m.marks / m.totalMarks) >= 0.4) subjectMap[m.subject].pass += 1;
  });

  const chartData = Object.entries(subjectMap).map(([subject, data]) => ({
    subject: subject.length > 12 ? subject.substring(0, 12) + '.' : subject,
    avgScore: Math.round(data.total / data.count),
    passRate: Math.round(data.pass / data.count * 100)
  }));

  const avgScore = marks.length > 0 ? Math.round(marks.reduce((a,m) => a + (m.marks / m.totalMarks * 100), 0) / marks.length) : 0;
  const passRate = marks.length > 0 ? Math.round(marks.filter(m => (m.marks / m.totalMarks) >= 0.4).length / marks.length * 100) : 0;

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-secondary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Reports</h2>
          <p className="text-muted m-0">View student performance reports.</p>
        </div>
      </div>

      {marks.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <FileText size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No report data</h5>
          <p className="m-0">Upload marks to generate reports.</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {[
              { label: 'Average Score', value: `${avgScore}%`, icon: <TrendingUp size={24} className="text-primary"/>, color: 'var(--primary)' },
              { label: 'Pass Rate', value: `${passRate}%`, icon: <FileText size={24} className="text-secondary"/>, color: 'var(--secondary)' },
              { label: 'Total Evaluated', value: marks.length, icon: <Users size={24} className="text-accent"/>, color: 'var(--accent)' },
            ].map((s,i) => (
              <div className="col-12 col-md-4" key={i}>
                <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                  <div><p className="text-muted fw-medium mb-1 small">{s.label}</p><h3 className="fw-bold m-0" style={{color:s.color}}>{s.value}</h3></div>
                  <div className="p-3 rounded-circle" style={{backgroundColor:`${s.color}15`}}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4"><FileText size={20} className="text-primary me-2"/>Subject Performance</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="avgScore" name="Avg Score" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="passRate" name="Pass Rate" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

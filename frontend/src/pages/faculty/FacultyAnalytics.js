import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, TrendingUp, Users, Award } from 'lucide-react';
import API from '../../services/api';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

const FacultyAnalytics = () => {
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

  // Build subject performance from real marks
  const subjectMap = {};
  marks.forEach(m => {
    if (!subjectMap[m.subject]) subjectMap[m.subject] = { total: 0, max: 0, count: 0, pass: 0 };
    subjectMap[m.subject].total += m.marks;
    subjectMap[m.subject].max += m.totalMarks;
    subjectMap[m.subject].count += 1;
    if ((m.marks / m.totalMarks) >= 0.4) subjectMap[m.subject].pass += 1;
  });

  const subjectData = Object.entries(subjectMap).map(([subject, data]) => ({
    subject: subject.length > 15 ? subject.substring(0, 15) + '.' : subject,
    avgScore: Math.round(data.total / data.count),
    passRate: Math.round(data.pass / data.count * 100)
  }));

  // Grade distribution
  const gradeRanges = { Distinction: 0, 'First Class': 0, 'Second Class': 0, Pass: 0, Fail: 0 };
  marks.forEach(m => {
    const pct = (m.marks / m.totalMarks) * 100;
    if (pct >= 75) gradeRanges.Distinction++;
    else if (pct >= 60) gradeRanges['First Class']++;
    else if (pct >= 50) gradeRanges['Second Class']++;
    else if (pct >= 40) gradeRanges.Pass++;
    else gradeRanges.Fail++;
  });
  const gradeData = Object.entries(gradeRanges)
    .filter(([, v]) => v > 0)
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));

  const avgScore = marks.length > 0 ? Math.round(marks.reduce((a,m) => a + (m.marks / m.totalMarks * 100), 0) / marks.length) : 0;

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-secondary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Department Analytics</h2>
        <p className="text-muted m-0">View student performance reports and trends.</p>
      </div>

      {marks.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <TrendingUp size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No analytics data</h5>
          <p className="m-0">Upload marks to see performance analytics here.</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {[
              { label: 'Average Score', value: `${avgScore}%`, icon: <TrendingUp size={24} className="text-primary"/>, color: 'var(--primary)' },
              { label: 'Total Evaluated', value: marks.length, icon: <FileText size={24} className="text-secondary"/>, color: 'var(--secondary)' },
              { label: 'Total Students', value: students.length, icon: <Users size={24} className="text-accent"/>, color: 'var(--accent)' },
            ].map((s,i) => (
              <div className="col-12 col-md-4" key={i}>
                <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                  <div><p className="text-muted fw-medium mb-1 small">{s.label}</p><h3 className="fw-bold m-0" style={{color:s.color}}>{s.value}</h3></div>
                  <div className="p-3 rounded-circle" style={{backgroundColor:`${s.color}15`}}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <div className="premium-card p-4">
                <h5 className="fw-bold mb-4"><FileText size={20} className="text-primary me-2"/>Subject Performance</h5>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer>
                    <BarChart data={subjectData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                      <Bar dataKey="avgScore" name="Avg Score" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="passRate" name="Pass Rate %" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="premium-card p-4">
                <h5 className="fw-bold mb-4"><Award size={20} className="text-accent me-2"/>Grade Distribution</h5>
                {gradeData.length === 0 ? (
                  <div className="text-center text-muted py-4">No grade data</div>
                ) : (
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={gradeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" label>
                          {gradeData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                        </Pie>
                        <Tooltip/><Legend/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyAnalytics;

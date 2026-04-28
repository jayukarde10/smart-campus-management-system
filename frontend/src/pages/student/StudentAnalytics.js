import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Award, FileText } from 'lucide-react';
import API from '../../services/api';

const StudentAnalytics = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await API.get('/student/marks');
        setMarks(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchMarks();
  }, []);

  // Build chart data from real marks
  const subjectMap = {};
  marks.forEach(m => {
    if (!subjectMap[m.subject]) subjectMap[m.subject] = { total: 0, max: 0, count: 0 };
    subjectMap[m.subject].total += m.marks;
    subjectMap[m.subject].max += m.totalMarks;
    subjectMap[m.subject].count += 1;
  });

  const marksData = Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    score: Math.round(data.total / data.count),
    percentage: Math.round(data.total / data.max * 100)
  }));

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0 text-text-main">Performance Analytics</h2>
        <p className="text-muted m-0">Track your academic progress based on your marks.</p>
      </div>

      {marks.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <TrendingUp size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No performance data yet</h5>
          <p className="m-0">Analytics will appear here once faculty uploads your marks.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div>
                  <p className="text-muted fw-medium mb-1 small">Total Exams</p>
                  <h3 className="fw-bold m-0 text-primary">{marks.length}</h3>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(79,70,229,0.1)' }}><FileText size={24} className="text-primary" /></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div>
                  <p className="text-muted fw-medium mb-1 small">Average Score</p>
                  <h3 className="fw-bold m-0 text-secondary">
                    {Math.round(marks.reduce((a,m) => a + m.marks, 0) / marks.length)}
                  </h3>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}><Award size={24} className="text-secondary" /></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div>
                  <p className="text-muted fw-medium mb-1 small">Subjects</p>
                  <h3 className="fw-bold m-0 text-accent">{marksData.length}</h3>
                </div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}><TrendingUp size={24} className="text-accent" /></div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Award size={20} className="text-secondary" /> Subject-wise Scores
            </h5>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer>
                <BarChart data={marksData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="score" name="Avg Score" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="percentage" name="Percentage" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAnalytics;

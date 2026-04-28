import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import API from '../../services/api';

const AnalyticsDashboard = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try student endpoint first, then faculty
        try {
          const res = await API.get('/student/marks');
          setMarks(res.data);
        } catch {
          const res = await API.get('/faculty/marks');
          setMarks(res.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Group marks by month for trend chart
  const monthMap = {};
  marks.forEach(m => {
    const month = new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short' });
    if (!monthMap[month]) monthMap[month] = { total: 0, max: 0, count: 0 };
    monthMap[month].total += m.marks;
    monthMap[month].max += m.totalMarks;
    monthMap[month].count += 1;
  });

  const chartData = Object.entries(monthMap).map(([month, data]) => ({
    month,
    score: Math.round(data.total / data.max * 100)
  }));

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Analytics Dashboard</h2>
        <p className="text-muted m-0">Overview of academic performance and trends.</p>
      </div>

      {marks.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <TrendingUp size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No analytics data yet</h5>
          <p className="m-0">Analytics will appear here once marks data is available.</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {[
              { label: 'Total Records', value: marks.length, icon: <TrendingUp size={24} className="text-primary"/>, color: 'var(--primary)' },
              { label: 'Subjects', value: [...new Set(marks.map(m => m.subject))].length, icon: <Activity size={24} className="text-secondary"/>, color: 'var(--secondary)' },
            ].map((s,i) => (
              <div className="col-12 col-md-6" key={i}>
                <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                  <div><p className="text-muted fw-medium mb-1 small">{s.label}</p><h3 className="fw-bold m-0" style={{color:s.color}}>{s.value}</h3></div>
                  <div className="p-3 rounded-circle" style={{backgroundColor:`${s.color}15`}}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="premium-card p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Activity size={20} className="text-primary"/>Performance Trend</h5>
              <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)'}}/>
                    <YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:'var(--text-muted)'}}/>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}/>
                    <Area type="monotone" dataKey="score" name="Score %" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity, Award } from 'lucide-react';

const StudentAnalytics = () => {
  // Mock Data
  const attendanceData = [
    { month: 'Aug', percentage: 95 },
    { month: 'Sep', percentage: 92 },
    { month: 'Oct', percentage: 88 },
    { month: 'Nov', percentage: 85 },
    { month: 'Dec', percentage: 90 },
    { month: 'Jan', percentage: 87 },
  ];

  const marksData = [
    { subject: 'Data Structures',  score: 85, average: 75 },
    { subject: 'Algorithms', score: 92, average: 70 },
    { subject: 'Databases', score: 78, average: 80 },
    { subject: 'OS', score: 88, average: 72 },
    { subject: 'Networks', score: 84, average: 65 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0 text-text-main">Performance Analytics</h2>
        <p className="text-muted m-0">Track your academic progress and attendance trends.</p>
      </div>

      <div className="row g-4 mb-4">
        {/* Attendance Area Chart */}
        <div className="col-12 col-lg-6">
          <div className="premium-card h-100 p-4">
            <div className="d-flex align-items-center mb-4 gap-2">
              <div className="p-2 bg-primary bg-opacity-10 rounded text-primary">
                <Activity size={20} />
              </div>
              <h5 className="fw-bold m-0">Monthly Attendance Trend</h5>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="percentage" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Subject Marks Bar Chart */}
        <div className="col-12 col-lg-6">
          <div className="premium-card h-100 p-4">
            <div className="d-flex align-items-center mb-4 gap-2">
              <div className="p-2 bg-secondary bg-opacity-10 rounded text-secondary">
                <Award size={20} />
              </div>
              <h5 className="fw-bold m-0">Marks vs Class Average</h5>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart data={marksData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                    cursor={{fill: 'transparent'}}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="score" name="Your Score" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="average" name="Class Average" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker Widget */}
      <div className="premium-card p-4">
        <div className="d-flex align-items-center mb-4 gap-2">
          <div className="p-2 bg-accent bg-opacity-10 rounded" style={{ color: 'var(--accent)' }}>
            <TrendingUp size={20} />
          </div>
          <h5 className="fw-bold m-0">Semester Goal Progress</h5>
        </div>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span className="fw-medium text-muted">Complete 40 credits</span>
            <span className="fw-bold">24 / 40</span>
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '60%', backgroundColor: 'var(--primary)' }}></div>
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between mb-1">
            <span className="fw-medium text-muted">Maintain 8.0+ CGPA</span>
            <span className="fw-bold text-secondary">8.4 Current</span>
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '84%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;

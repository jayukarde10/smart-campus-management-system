import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';

const FacultyAnalytics = () => {
  // Mock Data
  const attendanceTrends = [
    { week: 'Week 1', cs101: 94, se202: 88 },
    { week: 'Week 2', cs101: 92, se202: 85 },
    { week: 'Week 3', cs101: 95, se202: 89 },
    { week: 'Week 4', cs101: 89, se202: 82 },
    { week: 'Week 5', cs101: 91, se202: 86 },
  ];

  const gradeDistribution = [
    { grade: 'A (90-100)', count: 45 },
    { grade: 'B (80-89)', count: 62 },
    { grade: 'C (70-79)', count: 28 },
    { grade: 'D (60-69)', count: 12 },
    { grade: 'F (<60)', count: 5 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Department Insights</h2>
          <p className="text-muted m-0">Performance graphs and attendance trends for your assigned classes.</p>
        </div>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2">
          Generate Detailed Report
        </button>
      </div>

      <div className="row g-4 mb-4">
        {/* Department KPIs */}
        {[
          { title: "Average Attendance", value: "87.4%", trend: "+2.1%", type: 'up' },
          { title: "Students at Risk (<75%)", value: "14", trend: "-3", type: 'down' },
          { title: "Syllabus Completion", value: "65%", trend: "On Track", type: 'neutral' },
        ].map((kpi, idx) => (
           <div className="col-12 col-md-4" key={idx}>
             <div className="premium-card p-4 h-100">
               <p className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: '11px' }}>{kpi.title}</p>
               <div className="d-flex align-items-end justify-content-between">
                 <h2 className="fw-bold m-0 lh-1">{kpi.value}</h2>
                 <span className={`badge ${kpi.type === 'up' ? 'bg-success' : kpi.type === 'down' ? 'bg-danger' : 'bg-primary'} mb-1`}>
                    {kpi.trend}
                 </span>
               </div>
             </div>
           </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Attendance Trends */}
        <div className="col-12 col-xl-7">
          <div className="premium-card h-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <Activity size={20} className="text-primary"/> Class Attendance Trends
              </h5>
              <select className="form-select w-auto border-0 shadow-sm bg-light text-muted fw-bold">
                <option>Last 5 Weeks</option>
                <option>This Semester</option>
              </select>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                 <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorCs" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                       <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorSe" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4}/>
                       <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                   <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                   <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                     itemStyle={{ fontWeight: 'bold' }}
                   />
                   <Legend iconType="circle" />
                   <Area type="monotone" dataKey="cs101" name="CS101 (Data Struct)" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCs)" />
                   <Area type="monotone" dataKey="se202" name="SE202 (Software Eng)" stroke="var(--secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSe)" />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="col-12 col-xl-5">
           <div className="premium-card h-100 p-4">
             <div className="mb-4">
               <h5 className="fw-bold m-0 d-flex align-items-center gap-2 mb-1">
                 <TrendingUp size={20} className="text-accent"/> Grade Distribution
               </h5>
               <p className="text-muted small m-0 lh-1">Mid-term absolute performance</p>
             </div>
             
             <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer>
                   <BarChart data={gradeDistribution} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                     <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} hide />
                     <YAxis dataKey="grade" type="category" axisLine={false} tickLine={false} tick={{fill: '#0f172a', fontWeight: 'bold', fontSize: 13}} width={90} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                       cursor={{fill: 'rgba(79, 70, 229, 0.05)'}}
                     />
                     <Bar dataKey="count" name="Students" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAnalytics;

import React, { useState } from 'react';
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

const ManageStudents = () => {
  const [activeTab, setActiveTab] = useState('directory');

  const students = [
    { id: '101', name: 'Alice Johnson', course: 'Computer Science', year: '3rd Year', email: 'alice@campus.edu', status: 'Active' },
    { id: '102', name: 'Bob Smith', course: 'Information Tech', year: '2nd Year', email: 'bob@campus.edu', status: 'Active' },
    { id: '103', name: 'Charlie Davis', course: 'Electronics', year: '4th Year', email: 'charlie@campus.edu', status: 'Probation' },
  ];

  const pending = [
    { id: 'req_1', name: 'Diana Prince', program: 'MSc Data Science', date: 'Oct 14, 2023' },
    { id: 'req_2', name: 'Evan Wright', program: 'BSc Computer Sci', date: 'Oct 15, 2023' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-text-main">Student Management</h2>
          <p className="text-muted m-0">Directory access and registration approvals.</p>
        </div>
        <button className="btn-dynamic">
          <UserPlus size={18} /> Add New Student
        </button>
      </div>

      <div className="premium-card overflow-hidden">
        {/* Tabs */}
        <div className="d-flex border-bottom bg-light">
          <button 
            className={`flex-1 py-3 px-4 fw-bold border-0 bg-transparent ${activeTab === 'directory' ? 'text-primary border-bottom border-primary border-3 w-50' : 'text-muted w-50'}`}
            onClick={() => setActiveTab('directory')}
          >
            Enrolled Directory ({students.length})
          </button>
          <button 
            className={`flex-1 py-3 px-4 fw-bold border-0 bg-transparent ${activeTab === 'pending' ? 'text-primary border-bottom border-primary border-3 w-50' : 'text-muted w-50'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Registrations <span className="badge bg-danger ms-2">{pending.length}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'directory' ? (
            <>
              {/* Toolbar */}
              <div className="d-flex gap-3 mb-4">
                <div className="position-relative flex-grow-1">
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
                  <input type="text" className="premium-input ps-5 w-100" placeholder="Search by name, ID, or email..." />
                </div>
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2 rounded-3">
                  <Filter size={18} /> Filters
                </button>
              </div>

              {/* Data Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light text-muted">
                    <tr>
                      <th className="py-3 px-3 fw-bold border-0">Student ID</th>
                      <th className="py-3 px-3 fw-bold border-0">Name & Email</th>
                      <th className="py-3 px-3 fw-bold border-0">Course details</th>
                      <th className="py-3 px-3 fw-bold border-0">Status</th>
                      <th className="py-3 px-3 fw-bold border-0 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-3 fw-bold text-muted">#{student.id}</td>
                        <td className="px-3">
                          <div className="fw-bold">{student.name}</div>
                          <div className="text-muted small">{student.email}</div>
                        </td>
                        <td className="px-3">
                          <div className="fw-medium">{student.course}</div>
                          <div className="text-muted small">{student.year}</div>
                        </td>
                        <td className="px-3">
                          <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${student.status === 'Active' ? 'success' : 'warning'} px-3 py-2 rounded-pill`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-3 text-end">
                          <button className="btn btn-sm btn-light border text-primary rounded px-2 py-1 mx-1 hover-scale"><Edit size={16} /></button>
                          <button className="btn btn-sm btn-light border text-danger rounded px-2 py-1 mx-1 hover-scale"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
             <div className="row g-4">
               {pending.map(req => (
                 <div className="col-12 col-md-6" key={req.id}>
                   <div className="p-4 border rounded-3 bg-light d-flex justify-content-between align-items-center hover-shadow-sm transition-all">
                      <div>
                        <h5 className="fw-bold mb-1">{req.name}</h5>
                        <p className="text-muted mb-2 small">{req.program} • Applied: {req.date}</p>
                        <a href="#" className="text-primary small fw-bold text-decoration-none">View Documents</a>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-success d-flex align-items-center gap-2"><CheckCircle size={16} /> Approve</button>
                        <button className="btn btn-outline-danger d-flex align-items-center gap-2"><XCircle size={16} /> Reject</button>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;

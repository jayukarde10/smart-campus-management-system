import React from 'react';
import { BookOpen } from 'lucide-react';

const ClassManagement = () => {
  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Class Management</h2>
          <p className="text-muted m-0">Manage your assigned classes and sections.</p>
        </div>
      </div>

      <div className="premium-card p-5 text-center text-muted">
        <BookOpen size={48} className="mb-3 opacity-50" />
        <h5 className="fw-bold">No classes configured</h5>
        <p className="m-0">Class data will appear here once classes are set up by administration.</p>
      </div>
    </div>
  );
};

export default ClassManagement;

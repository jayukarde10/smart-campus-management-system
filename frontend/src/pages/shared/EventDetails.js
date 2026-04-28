import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <button className="btn btn-light border mb-4 d-flex align-items-center gap-2 fw-bold" onClick={() => navigate(-1)}>
        <ArrowLeft size={18}/> Back to Events
      </button>

      <div className="premium-card p-5 text-center text-muted">
        <Calendar size={48} className="mb-3 opacity-50" />
        <h5 className="fw-bold">Event details not available</h5>
        <p className="m-0">No event data to display. Please go back to the events page.</p>
      </div>
    </div>
  );
};

export default EventDetails;

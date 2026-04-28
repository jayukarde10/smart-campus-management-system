import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import API from '../../services/api';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await API.get('/student/fees');
        setFees(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFees();
  }, []);

  const totalDue = fees.reduce((a, f) => a + f.amount, 0);
  const totalPaid = fees.reduce((a, f) => a + f.paid, 0);
  const balance = totalDue - totalPaid;

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold m-0">Fee Status</h2>
        <p className="text-muted m-0">Track your fee payments and dues.</p>
      </div>

      {fees.length === 0 ? (
        <div className="premium-card p-5 text-center text-muted">
          <CreditCard size={48} className="mb-3 opacity-50" />
          <h5 className="fw-bold">No fee records available</h5>
          <p className="m-0">Fee details will be shown here once assigned by the administration.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div><p className="text-muted fw-medium mb-1 small">Total Due</p><h3 className="fw-bold m-0 text-primary">₹{totalDue.toLocaleString()}</h3></div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(79,70,229,0.1)' }}><CreditCard size={24} className="text-primary"/></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div><p className="text-muted fw-medium mb-1 small">Total Paid</p><h3 className="fw-bold m-0 text-success">₹{totalPaid.toLocaleString()}</h3></div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}><CheckCircle size={24} className="text-success"/></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="premium-card p-4 d-flex align-items-center justify-content-between border-0 shadow-sm">
                <div><p className="text-muted fw-medium mb-1 small">Balance</p><h3 className="fw-bold m-0" style={{ color: balance > 0 ? 'var(--danger)' : 'var(--secondary)' }}>₹{balance.toLocaleString()}</h3></div>
                <div className="p-3 rounded-circle" style={{ backgroundColor: balance > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' }}>
                  {balance > 0 ? <AlertTriangle size={24} className="text-danger"/> : <CheckCircle size={24} className="text-success"/>}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Table */}
          <div className="premium-card overflow-hidden">
            <div className="p-4 border-bottom"><h5 className="fw-bold m-0"><CreditCard size={20} className="text-primary me-2"/>Fee Details</h5></div>
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="py-3 px-3 fw-bold border-0">Fee Type</th>
                    <th className="py-3 px-3 fw-bold border-0">Amount</th>
                    <th className="py-3 px-3 fw-bold border-0">Paid</th>
                    <th className="py-3 px-3 fw-bold border-0">Status</th>
                    <th className="py-3 px-3 fw-bold border-0">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(f => (
                    <tr key={f._id}>
                      <td className="px-3 fw-bold">{f.feeType}</td>
                      <td className="px-3 fw-bold">₹{f.amount?.toLocaleString()}</td>
                      <td className="px-3" style={{ color: f.paid >= f.amount ? '#10B981' : '#F59E0B' }}>₹{f.paid?.toLocaleString()}</td>
                      <td className="px-3">
                        <span className={`badge rounded-pill px-3 py-1 ${f.status === 'paid' ? 'bg-success bg-opacity-10 text-success' : f.status === 'partial' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>
                          {f.status === 'paid' ? <><CheckCircle size={12} className="me-1"/>Paid</> : f.status === 'partial' ? <><Clock size={12} className="me-1"/>Partial</> : <><AlertTriangle size={12} className="me-1"/>Pending</>}
                        </span>
                      </td>
                      <td className="px-3 text-muted small">{f.dueDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Fees;

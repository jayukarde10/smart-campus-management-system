import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, ArrowRight, User, GraduationCap } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await API.post("/auth/register", { name, email, password, role });
      
      if (role === "faculty") {
        setSuccessMsg(res.data.message || "Faculty account created! Please wait for admin approval.");
        // Don't redirect — show the message
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isFaculty = role === "faculty";

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative border-0" 
         style={{ background: isFaculty ? 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #f3e8ff, #e0e7ff, #dbeafe)' }}>
      
      {/* Decorative Blobs */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: isFaculty ? 'radial-gradient(#34d399, #10b981)' : 'radial-gradient(#a78bfa, #c084fc)', filter: 'blur(80px)', top: '-10%', right: '-10%', opacity: 0.4 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: isFaculty ? 'radial-gradient(#6ee7b7, #059669)' : 'radial-gradient(#38bdf8, #818cf8)', filter: 'blur(80px)', bottom: '-5%', left: '-5%', opacity: 0.4 }}></div>

      <div className="col-11 col-md-8 col-lg-5 z-1 animate-fade-in py-5">
        <div className="glass-panel p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-1 text-gradient d-inline-block">Join Smart Campus</h2>
            <p className="text-muted mt-2">Create your account to get started</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-4" style={{ fontSize: '14px', borderLeft: '4px solid var(--danger)' }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 mb-4" style={{ fontSize: '14px', borderLeft: '4px solid var(--secondary)' }}>
              <strong>✅ {successMsg}</strong>
              <p className="m-0 mt-2 small">You can now go to the <Link to="/" className="fw-bold">Login page</Link> and wait for admin approval.</p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-4 position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="premium-input ps-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="premium-input ps-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="premium-input ps-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-5 position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted z-1">
                <GraduationCap size={18} />
              </div>
              <select 
                className="premium-input ps-5 text-muted form-select bg-transparent shadow-none" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student Account</option>
                <option value="faculty">Faculty Account</option>
              </select>
              {isFaculty && (
                <small className="text-warning d-block mt-2 fw-medium">
                  ⚠️ Faculty accounts require administrator approval before login.
                </small>
              )}
            </div>

            <button type="submit" className="btn-dynamic w-100 py-3 mb-4" 
                    style={{ backgroundColor: isFaculty ? 'var(--secondary)' : '' }} 
                    disabled={loading || successMsg}>
              {loading ? "Creating Account..." : `Create ${isFaculty ? 'Faculty' : 'Student'} Account`}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-muted m-0" style={{ fontSize: '14px' }}>
              Already have an account? <Link to="/" className="text-primary fw-bold text-decoration-none ms-1">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

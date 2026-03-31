import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, LogIn, ArrowRight, User, GraduationCap } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Determine context via toggle (default student)
  const [loginRole, setLoginRole] = useState("student"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Pass requested role to API (so backend can reject if user tries logging into faculty with student credentials)
      const res = await API.post("/auth/login", { email, password, requestedRole: loginRole });
      const token = res.data.token;
      
      localStorage.setItem("token", token);
      
      // Decode to confirm role and route securely
      const decoded = jwtDecode(token);
      const role = decoded.role || loginRole;

      if (role !== loginRole) {
        throw new Error(`Unauthorized. This account does not have ${loginRole} privileges.`);
      }

      // Redirect based on role
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError(err.message || err.response?.data?.message || "Invalid credentials");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const isFaculty = loginRole === "faculty";

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative border-0" 
         style={{ background: isFaculty ? 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)' : 'linear-gradient(135deg, #f3e8ff, #e0e7ff, #dbeafe)', transition: 'background 0.5s ease-in-out' }}>
      
      {/* Decorative Blobs */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: isFaculty ? 'radial-gradient(#34d399, #10b981)' : 'radial-gradient(#a78bfa, #c084fc)', filter: 'blur(80px)', top: '-10%', left: '-10%', opacity: 0.4, transition: 'var(--transition)' }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: isFaculty ? 'radial-gradient(#6ee7b7, #059669)' : 'radial-gradient(#38bdf8, #818cf8)', filter: 'blur(80px)', bottom: '-5%', right: '-5%', opacity: 0.4, transition: 'var(--transition)' }}></div>

      <div className="col-11 col-md-8 col-lg-4 z-1 animate-fade-in">
        <div className="glass-panel p-5" style={{ borderColor: isFaculty ? 'rgba(16, 185, 129, 0.3)' : 'rgba(79, 70, 229, 0.3)' }}>
          
          {/* Role Toggle Switch */}
          <div className="d-flex bg-white rounded-pill p-1 mb-5 shadow-sm border">
            <button 
              className={`w-50 rounded-pill py-2 border-0 d-flex align-items-center justify-content-center gap-2 fw-bold ${!isFaculty ? 'text-white shadow' : 'bg-transparent text-muted'}`}
              style={{ backgroundColor: !isFaculty ? 'var(--primary)' : 'transparent', transition: 'var(--transition)' }}
              onClick={() => { setLoginRole('student'); setError(""); }}
            >
              <User size={18} /> Student
            </button>
            <button 
              className={`w-50 rounded-pill py-2 border-0 d-flex align-items-center justify-content-center gap-2 fw-bold ${isFaculty ? 'text-white shadow' : 'bg-transparent text-muted'}`}
              style={{ backgroundColor: isFaculty ? 'var(--secondary)' : 'transparent', transition: 'var(--transition)' }}
              onClick={() => { setLoginRole('faculty'); setError(""); }}
            >
              <GraduationCap size={18} /> Faculty
            </button>
          </div>

          <div className="text-center mb-5">
            <div className={`d-inline-flex p-3 rounded-circle mb-3 shadow-sm ${isFaculty ? 'bg-secondary' : 'bg-gradient-primary'}`} style={{ transition: 'var(--transition)' }}>
              <LogIn color="white" size={32} />
            </div>
            <h2 className="fw-bold mb-1">Welcome Back</h2>
            <p className="text-muted">Sign in to your {isFaculty ? 'Faculty' : 'Student'} portal</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-4 animate-fade-in" style={{ fontSize: '14px', borderLeft: '4px solid var(--danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4 position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder={`${isFaculty ? 'Faculty' : 'Student'} Email ID`}
                className="premium-input ps-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: isFaculty ? 'var(--secondary)' : '' }}
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

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" style={{ accentColor: isFaculty ? 'var(--secondary)' : 'var(--primary)' }}/>
                <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '14px' }}>Remember me</label>
              </div>
              <a href="#" className="text-decoration-none fw-medium" style={{ fontSize: '14px', color: isFaculty ? 'var(--secondary)' : 'var(--primary)' }}>Forgot Password?</a>
            </div>

            <button type="submit" className="w-100 py-3 mb-4 text-white border-0 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow hover-zoom" 
                    style={{ backgroundColor: isFaculty ? 'var(--secondary)' : 'var(--primary)', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Authenticating..." : `Sign In as ${isFaculty ? 'Faculty' : 'Student'}`}
              {!loading && <ArrowRight size={18} />}
            </button>

            {!isFaculty && (
              <p className="text-center text-muted m-0" style={{ fontSize: '14px' }}>
                Don't have an account? <Link to="/register" className="fw-bold text-decoration-none ms-1" style={{ color: 'var(--primary)' }}>Register here</Link>
              </p>
            )}
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
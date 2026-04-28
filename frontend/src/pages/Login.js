import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, LogIn, ArrowRight, User, GraduationCap, Shield } from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("student"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await API.post("/auth/login", { email, password, requestedRole: loginRole });
      const token = res.data.token;
      
      localStorage.setItem("token", token);
      
      const decoded = jwtDecode(token);
      const role = decoded.role || loginRole;

      if (role !== loginRole) {
        throw new Error(`Unauthorized. This account does not have ${loginRole} privileges.`);
      }

      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Invalid credentials");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = loginRole === "admin";
  const isFaculty = loginRole === "faculty";

  const getThemeColor = () => {
    if (isAdmin) return '#F59E0B';
    if (isFaculty) return 'var(--secondary)';
    return 'var(--primary)';
  };

  const getGradient = () => {
    if (isAdmin) return 'linear-gradient(135deg, #fffbeb, #fef3c7, #fde68a)';
    if (isFaculty) return 'linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0)';
    return 'linear-gradient(135deg, #f3e8ff, #e0e7ff, #dbeafe)';
  };

  const getBlob1 = () => {
    if (isAdmin) return 'radial-gradient(#fbbf24, #f59e0b)';
    if (isFaculty) return 'radial-gradient(#34d399, #10b981)';
    return 'radial-gradient(#a78bfa, #c084fc)';
  };

  const getBlob2 = () => {
    if (isAdmin) return 'radial-gradient(#f59e0b, #d97706)';
    if (isFaculty) return 'radial-gradient(#6ee7b7, #059669)';
    return 'radial-gradient(#38bdf8, #818cf8)';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrator';
    if (isFaculty) return 'Faculty';
    return 'Student';
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 position-relative border-0" 
         style={{ background: getGradient(), transition: 'background 0.5s ease-in-out' }}>
      
      {/* Decorative Blobs */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: getBlob1(), filter: 'blur(80px)', top: '-10%', left: '-10%', opacity: 0.4, transition: 'all 0.5s ease' }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: getBlob2(), filter: 'blur(80px)', bottom: '-5%', right: '-5%', opacity: 0.4, transition: 'all 0.5s ease' }}></div>

      <div className="col-11 col-md-8 col-lg-4 z-1 animate-fade-in">
        <div className="glass-panel p-5" style={{ borderColor: `${getThemeColor()}33` }}>
          
          {/* Role Toggle Switch — 3 tabs */}
          <div className="d-flex bg-white rounded-pill p-1 mb-5 shadow-sm border">
            <button 
              className={`rounded-pill py-2 border-0 d-flex align-items-center justify-content-center gap-1 fw-bold ${loginRole === 'student' ? 'text-white shadow' : 'bg-transparent text-muted'}`}
              style={{ flex: 1, backgroundColor: loginRole === 'student' ? 'var(--primary)' : 'transparent', transition: 'all 0.3s ease', fontSize: '13px' }}
              onClick={() => { setLoginRole('student'); setError(""); setSuccessMsg(""); }}
            >
              <User size={16} /> Student
            </button>
            <button 
              className={`rounded-pill py-2 border-0 d-flex align-items-center justify-content-center gap-1 fw-bold ${isFaculty ? 'text-white shadow' : 'bg-transparent text-muted'}`}
              style={{ flex: 1, backgroundColor: isFaculty ? 'var(--secondary)' : 'transparent', transition: 'all 0.3s ease', fontSize: '13px' }}
              onClick={() => { setLoginRole('faculty'); setError(""); setSuccessMsg(""); }}
            >
              <GraduationCap size={16} /> Faculty
            </button>
            <button 
              className={`rounded-pill py-2 border-0 d-flex align-items-center justify-content-center gap-1 fw-bold ${isAdmin ? 'text-white shadow' : 'bg-transparent text-muted'}`}
              style={{ flex: 1, backgroundColor: isAdmin ? '#F59E0B' : 'transparent', transition: 'all 0.3s ease', fontSize: '13px' }}
              onClick={() => { setLoginRole('admin'); setError(""); setSuccessMsg(""); }}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          <div className="text-center mb-5">
            <div className="d-inline-flex p-3 rounded-circle mb-3 shadow-sm" style={{ background: getThemeColor(), transition: 'all 0.3s ease' }}>
              <LogIn color="white" size={32} />
            </div>
            <h2 className="fw-bold mb-1">Welcome Back</h2>
            <p className="text-muted">Sign in to your {getRoleLabel()} portal</p>
            {isAdmin && (
              <p className="text-muted small mb-0" style={{ fontSize: '12px' }}>
                Administrator has full control over the system including managing users, data, security, and system settings.
              </p>
            )}
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-4 animate-fade-in" style={{ fontSize: '14px', borderLeft: '4px solid var(--danger)' }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-4 animate-fade-in" style={{ fontSize: '14px', borderLeft: '4px solid var(--secondary)' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4 position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder={`${getRoleLabel()} Email ID`}
                className="premium-input ps-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: isAdmin ? '#F59E0B' : isFaculty ? 'var(--secondary)' : '' }}
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
                <input type="checkbox" className="form-check-input" id="rememberMe" style={{ accentColor: getThemeColor() }}/>
                <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '14px' }}>Remember me</label>
              </div>
            </div>

            <button type="submit" className="w-100 py-3 mb-4 text-white border-0 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow hover-zoom" 
                    style={{ backgroundColor: getThemeColor(), transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Authenticating..." : `Sign In as ${getRoleLabel()}`}
              {!loading && <ArrowRight size={18} />}
            </button>

            {loginRole === 'student' && (
              <p className="text-center text-muted m-0" style={{ fontSize: '14px' }}>
                Don't have an account? <Link to="/register" className="fw-bold text-decoration-none ms-1" style={{ color: 'var(--primary)' }}>Register here</Link>
              </p>
            )}

            {isFaculty && (
              <p className="text-center text-muted m-0" style={{ fontSize: '14px' }}>
                New faculty? <Link to="/register" className="fw-bold text-decoration-none ms-1" style={{ color: 'var(--secondary)' }}>Register here</Link>
                <br/>
                <small className="text-muted">Admin approval required after registration</small>
              </p>
            )}
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
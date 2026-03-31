import React from "react";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Smart Campus</span>

      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
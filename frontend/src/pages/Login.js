import React, { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await API.post("/auth/login", {
      email,
      password
    });

    console.log("LOGIN RESPONSE:", res.data); // 👈 DEBUG

    // 🔥 Save token properly
    localStorage.setItem("token", res.data.token);

    alert("Login successful");

    // redirect
    window.location.href = "/dashboard";

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="container mt-5">
      <div className="col-md-4 mx-auto card p-4 shadow">
        <h3 className="text-center">Login</h3>

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (res.ok) {
        navigate("/todo"); // ✅ redirect to Task page
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Login</h2>
        {/* ✅ Removed <form onSubmit>, kept styling */}
        <div className="login-form">
          <input
            type="text"
            placeholder="Username or Email"
            required
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ Button now uses onClick instead of form submit */}
          <button type="button" className="page-btn" onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="signup-text">
          Don’t have an account? <a href="/register">Sign up here</a>
        </p>
      </div>
    </div>
  );
}

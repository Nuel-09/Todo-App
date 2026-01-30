import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();




  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (res.ok) {
        setSuccessMessage("✅ Registration was successful! Redirecting...");
        setTimeout(() => navigate("/todo"), 2000); // go straight to Task page
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="page-btn">Register</button>
        </form>

        {/* ✅ Login link under button, aligned left */}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>

        {successMessage && (
          <p style={{ color: "lightgreen", marginTop: "1rem" }}>{successMessage}</p>
        )}



      </div>
    </div>
  );
}

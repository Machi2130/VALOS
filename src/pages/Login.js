// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import "../common.css";
export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("pratham@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Login function now saves the token automatically
      await login(username, password);
      
      // Verify token was saved
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        throw new Error("Token was not saved properly");
      }
      
      console.log("✅ Login successful, token saved");
      setLoading(false);
      navigate("/"); // go to dashboard
    } catch (err) {
      console.error("❌ Login error:", err);
      setLoading(false);
      setError(
        err.response?.data?.detail || "Login failed. Check username/password."
      );
    }
  };

  return (
    <div className="login-page">
      <div
        style={{
          width: 360,
          padding: 24,
          borderRadius: 8,
          background: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 16, textAlign: "center" }}>
          Sales & Costing – Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
                background: "#fee2e2",
                color: "#b91c1c",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
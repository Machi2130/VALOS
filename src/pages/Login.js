// // src/pages/Login.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../api/api";
// import "../common.css";
// export default function Login() {
//   const [username, setUsername] = useState("admin");
//   const [password, setPassword] = useState("pratham@123");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
    
//     try {
//       // Login function now saves the token automatically
//       await login(username, password);
      
//       // Verify token was saved
//       const savedToken = localStorage.getItem("token");
//       if (!savedToken) {
//         throw new Error("Token was not saved properly");
//       }
      
//       console.log("✅ Login successful, token saved");
//       setLoading(false);
//       navigate("/"); // go to dashboard
//     } catch (err) {
//       console.error("❌ Login error:", err);
//       setLoading(false);
//       setError(
//         err.response?.data?.detail || "Login failed. Check username/password."
//       );
//     }
//   };

//   return (
//     <div className="login-page">
//       <div
//         style={{
//           width: 360,
//           padding: 24,
//           borderRadius: 8,
//           background: "#ffffff",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h2 style={{ marginBottom: 16, textAlign: "center" }}>
//           Sales & Costing – Login
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: 12 }}>
//             <label style={{ display: "block", marginBottom: 4 }}>Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: 8,
//                 borderRadius: 4,
//                 border: "1px solid #d1d5db",
//               }}
//             />
//           </div>

//           <div style={{ marginBottom: 12 }}>
//             <label style={{ display: "block", marginBottom: 4 }}>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: 8,
//                 borderRadius: 4,
//                 border: "1px solid #d1d5db",
//               }}
//             />
//           </div>

//           {error && (
//             <div
//               style={{
//                 marginBottom: 12,
//                 padding: 8,
//                 borderRadius: 4,
//                 background: "#fee2e2",
//                 color: "#b91c1c",
//                 fontSize: 14,
//               }}
//             >
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: "100%",
//               padding: 10,
//               borderRadius: 4,
//               border: "none",
//               background: "#2563eb",
//               color: "#ffffff",
//               fontWeight: 600,
//               cursor: loading ? "not-allowed" : "pointer",
//               opacity: loading ? 0.7 : 1,
//             }}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api"; // Ensure this path is correct in your project
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
      // Call the login function from api.js (which now correctly points to the right backend)
      await login(username, password);

      // Verify token was saved
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        throw new Error("Token was not saved properly");
      }

      console.log("✅ Login successful, token saved");
      setLoading(false);
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      console.error("❌ Login error:", err);

      // Improved error message handling
      const errorMessage =
        err.detail ||
        err.message ||
        err?.response?.data?.detail ||
        "Login failed. Please check your username and password.";

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          width: 360,
          maxWidth: "90%",
          padding: 32,
          borderRadius: 12,
          background: "#ffffff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            marginBottom: 24,
            textAlign: "center",
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#1e293b",
          }}
        >
          Sales & Costing – Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.95rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                backgroundColor: "#fff",
              }}
              placeholder="Enter username"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: "0.95rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                backgroundColor: "#fff",
              }}
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                borderRadius: 8,
                background: "#fee2e2",
                color: "#b91c1c",
                fontSize: "0.95rem",
                border: "1px solid #fecaca",
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
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = "#1d4ed8";
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = "#2563eb";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

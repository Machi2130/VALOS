// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Keep body class in sync
    if (collapsed) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }

    // cleanup on unmount
    return () => {
      document.body.classList.remove("sidebar-collapsed");
    };
  }, [collapsed]);

  // Close sidebar on route change when collapsed? keep as-is
  useEffect(() => {
    // optional: if you want the sidebar to auto-collapse on nav in mobile
  }, [location]);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div
        className="toggle-btn"
        role="button"
        title={collapsed ? "Expand" : "Collapse"}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "›" : "‹"}
      </div>

      {!collapsed && <h2>VALOS</h2>}

      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/costings">Costings</Link></li>
        <li><Link to="/costing/new">New Costing</Link></li>
        <li><Link to="/leads">Lead Tracker</Link></li>
        <li><Link to="/sales-database">Sales Database</Link></li>
        <li><Link to="/sales-performance">Sales Performance</Link></li>
        <li><Link to="/quotation">Quotation</Link></li>
      </ul>
    </div>
  );
}




import React, { useEffect, useState } from "react";
import axios from "axios";
import "../common.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function SalesPerformance() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Try stats endpoint first
      try {
        const statsRes = await axios.get(`${API_BASE}/leads/stats/`, {
          headers: getAuthHeaders(),
        });
        
        setStats({
          total: statsRes.data.total || 0,
          new: statsRes.data.new || 0,
          contacted: statsRes.data.contacted || 0,
          qualified: statsRes.data.qualified || 0,
          converted: statsRes.data.converted || 0,
          lost: statsRes.data.lost || 0,
        });
      } catch (statsErr) {
        // If stats endpoint doesn't exist, fetch all leads
        console.log("Stats endpoint not available, fetching all leads...");
        
        const leadsRes = await axios.get(`${API_BASE}/leads/`, {
          headers: getAuthHeaders(),
        });

        const leads = leadsRes.data.items || leadsRes.data || [];

        // Count leads by status
        const counts = {
          total: leads.length,
          new: leads.filter(l => l.status === "new").length,
          contacted: leads.filter(l => l.status === "contacted").length,
          qualified: leads.filter(l => l.status === "qualified").length,
          converted: leads.filter(l => l.status === "converted").length,
          lost: leads.filter(l => l.status === "lost").length,
        };

        setStats(counts);
      }

      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      console.error("Failed to load sales data:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to load sales data: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !lastUpdated) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading sales performance...</div>
      </div>
    );
  }

  if (error && !lastUpdated) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
        <button onClick={loadStats} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  // Calculate metrics
  const conversionRate = stats.total > 0 
    ? ((stats.converted / stats.total) * 100).toFixed(1) 
    : 0;

  const lostRate = stats.total > 0
    ? ((stats.lost / stats.total) * 100).toFixed(1)
    : 0;

  const activePipeline = stats.new + stats.contacted + stats.qualified;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="costing-list-header">
        <div>
          <h1>Sales Performance Dashboard</h1>
          <p className="dashboard-welcome">
            Real-time overview of your sales pipeline
            {lastUpdated && (
              <span style={{ fontSize: '0.85em', color: '#94a3b8', marginLeft: '10px' }}>
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={loadStats} 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="dashboard-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {/* Total Leads */}
        <div className="dashboard-card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none'
        }}>
          <h3 style={{ color: 'rgba(255,255,255,0.9)' }}>Total Leads</h3>
          <p className="dashboard-card-number" style={{ color: 'white' }}>
            {stats.total}
          </p>
          <p className="dashboard-card-description" style={{ color: 'rgba(255,255,255,0.8)' }}>
            All leads in system
          </p>
        </div>

        {/* New Leads */}
        <div className="dashboard-card">
          <h3>New Leads</h3>
          <p className="dashboard-card-number dashboard-card-number-blue">
            {stats.new}
          </p>
          <p className="dashboard-card-description">
            Awaiting first contact
          </p>
        </div>

        {/* Contacted */}
        <div className="dashboard-card">
          <h3>Contacted</h3>
          <p className="dashboard-card-number" style={{ color: '#8b5cf6' }}>
            {stats.contacted}
          </p>
          <p className="dashboard-card-description">
            Initial contact made
          </p>
        </div>

        {/* Qualified */}
        <div className="dashboard-card">
          <h3>Qualified</h3>
          <p className="dashboard-card-number" style={{ color: '#f59e0b' }}>
            {stats.qualified}
          </p>
          <p className="dashboard-card-description">
            Meeting criteria
          </p>
        </div>

        {/* Converted */}
        <div className="dashboard-card">
          <h3>Converted</h3>
          <p className="dashboard-card-number dashboard-card-number-green">
            {stats.converted}
          </p>
          <p className="dashboard-card-description">
            Successfully closed
          </p>
        </div>

        {/* Lost */}
        <div className="dashboard-card">
          <h3>Lost</h3>
          <p className="dashboard-card-number" style={{ color: '#ef4444' }}>
            {stats.lost}
          </p>
          <p className="dashboard-card-description">
            Opportunities lost
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="dashboard-cards" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        marginTop: '20px'
      }}>
        {/* Conversion Rate */}
        <div className="dashboard-quick-actions">
          <h3>Conversion Rate</h3>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <span style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#10b981' 
            }}>
              {conversionRate}%
            </span>
            <span className="dashboard-card-description">
              ({stats.converted} of {stats.total} leads)
            </span>
          </div>
          <div style={{
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${conversionRate}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Loss Rate */}
        <div className="dashboard-quick-actions">
          <h3>Loss Rate</h3>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <span style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#ef4444' 
            }}>
              {lostRate}%
            </span>
            <span className="dashboard-card-description">
              ({stats.lost} of {stats.total} leads)
            </span>
          </div>
          <div style={{
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${lostRate}%`,
              background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Pipeline Health */}
        <div className="dashboard-quick-actions">
          <h3>Active Pipeline</h3>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <span style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#3b82f6' 
            }}>
              {activePipeline}
            </span>
            <span className="dashboard-card-description">
              leads in progress
            </span>
          </div>
          <div className="dashboard-card-description" style={{ fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '5px' }}>
              🆕 New: {stats.new} | 📞 Contacted: {stats.contacted}
            </div>
            <div>
              ✅ Qualified: {stats.qualified}
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown Table */}
      <div className="dashboard-quick-actions" style={{ marginTop: '20px' }}>
        <h3>Status Breakdown</h3>
        <div className="table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Count</th>
                <th style={{ textAlign: 'right' }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="status-badge status-new">New</span></td>
                <td style={{ textAlign: 'right' }} className="strong">{stats.new}</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.total > 0 ? ((stats.new / stats.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr>
                <td><span className="status-badge status-contacted">Contacted</span></td>
                <td style={{ textAlign: 'right' }} className="strong">{stats.contacted}</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.total > 0 ? ((stats.contacted / stats.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr>
                <td><span className="status-badge status-qualified">Qualified</span></td>
                <td style={{ textAlign: 'right' }} className="strong">{stats.qualified}</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr>
                <td><span className="status-badge status-won">Converted</span></td>
                <td style={{ textAlign: 'right' }} className="strong">{stats.converted}</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
              <tr>
                <td><span className="status-badge status-lost">Lost</span></td>
                <td style={{ textAlign: 'right' }} className="strong">{stats.lost}</td>
                <td style={{ textAlign: 'right' }}>
                  {stats.total > 0 ? ((stats.lost / stats.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
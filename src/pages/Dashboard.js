// ============================================================================
// Dashboard.js - Updated without inline styles
// ============================================================================

import React, { useEffect, useState } from "react";
import { getSalesLeads, getCostings } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalLeads: 0,
        totalCostings: 0,
        username: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const username = localStorage.getItem("username");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const [leadsData, costingsData] = await Promise.all([
                    getSalesLeads({ skip: 0, limit: 1 }).catch(() => ({ total: 0 })),
                    getCostings({ skip: 0, limit: 1 }).catch(() => ({ total: 0 }))
                ]);

                setStats({
                    totalLeads: leadsData.length || 0,
                    totalCostings: costingsData.length || 0,
                    username: username || "User"
                });
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [navigate]);

    if (loading) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <p className="dashboard-welcome">Welcome to VALOS internal panel, {stats.username}!</p>

            <div className="dashboard-cards">
                <div className="dashboard-card" onClick={() => navigate("/sales-database")}>
                    <h3>Sales Leads</h3>
                    <p className="dashboard-card-number dashboard-card-number-blue">
                        {stats.totalLeads}
                    </p>
                    <p className="dashboard-card-description">
                        Track new & contacted client leads.
                    </p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/costings")}>
                    <h3>Costing Engine</h3>
                    <p className="dashboard-card-number dashboard-card-number-green">
                        {stats.totalCostings}
                    </p>
                    <p className="dashboard-card-description">
                        Create costings & generate quotations.
                    </p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/leads")}>
                    <h3>Lead Tracker</h3>
                    <p className="dashboard-card-number">
                        📊
                    </p>
                    <p className="dashboard-card-description">
                        Manage leads through sales pipeline.
                    </p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/sales-performance")}>
                    <h3>Performance</h3>
                    <p className="dashboard-card-number">
                        📈
                    </p>
                    <p className="dashboard-card-description">
                        View sales performance metrics.
                    </p>
                </div>
            </div>

            <div className="dashboard-quick-actions">
                <h3>Quick Actions</h3>
                <div className="dashboard-action-buttons">
                    <button 
                        onClick={() => navigate("/costing/new")}
                        className="btn btn-primary"
                    >
                        + New Costing
                    </button>
                    <button 
                        onClick={() => navigate("/sales-database")}
                        className="btn btn-success"
                    >
                        View All Leads
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../common.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Quotation() {
  const navigate = useNavigate();
  const [costings, setCostings] = useState([]);
  const [projectCodes, setProjectCodes] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [filteredCostings, setFilteredCostings] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCostings();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const filtered = costings.filter(c => c.project_code === selectedProject);
      setFilteredCostings(filtered);
      
      // Initialize quantities
      const initialQty = {};
      filtered.forEach(c => {
        initialQty[c.id] = 10000;
      });
      setQuantities(initialQty);
    }
  }, [selectedProject, costings]);

  const loadCostings = async () => {
    try {
      setLoading(true);

      // Try without query params first
      const res = await axios.get(`${API_BASE}/costings/`, {
        headers: getAuthHeaders(),
      });
      
      const costingData = res.data.items || res.data || [];
      
      setCostings(costingData);

      const uniqueCodes = [...new Set(costingData.map(c => c.project_code))].filter(Boolean);
      setProjectCodes(uniqueCodes);

      if (uniqueCodes.length > 0) {
        setSelectedProject(uniqueCodes[0]);
      }

      setError("");
    } catch (err) {
      console.error("Failed to load costings:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to load costings: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (costingId, newQty) => {
    setQuantities(prev => ({
      ...prev,
      [costingId]: Number(newQty) || 0
    }));
  };

  const calculateRowTotal = (costing) => {
    const qty = quantities[costing.id] || 0;
    // Ensure unit price is a number - handle string, null, undefined
    const unitPrice = parseFloat(costing.final_unit_price) || 0;
    return qty * unitPrice;
  };

  const calculateGrandTotal = () => {
    return filteredCostings.reduce((sum, costing) => {
      return sum + calculateRowTotal(costing);
    }, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveQuotation = async () => {
    try {
      const quotationData = {
        project_code: selectedProject,
        items: filteredCostings.map(costing => ({
          costing_id: costing.id,
          product_name: costing.product_name,
          quantity: quantities[costing.id] || 0,
          unit_price: parseFloat(costing.final_unit_price) || 0,
          total: calculateRowTotal(costing)
        })),
        grand_total: calculateGrandTotal()
      };

      await axios.post(
        `${API_BASE}/quotations/`,
        quotationData,
        { headers: getAuthHeaders() }
      );

      alert("Quotation saved successfully!");
    } catch (err) {
      console.error("Failed to save quotation:", err);
      alert("Failed to save quotation: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading costings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/costings")} className="btn btn-primary">
          Back to Costings
        </button>
      </div>
    );
  }

  if (projectCodes.length === 0) {
    return (
      <div className="dashboard-container">
        <h1>Quotation Generator</h1>
        <div className="empty">
          <p>No costings available to generate quotations</p>
          <button onClick={() => navigate("/costings")} className="btn btn-primary">
            Create Costing First
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="costing-list">
      {/* Header */}
      <div className="costing-list-header">
        <div>
          <h1>Quotation Generator</h1>
          <p className="dashboard-welcome">
            Generate professional quotations from your costings
          </p>
        </div>
        <div className="action-buttons">
          <button onClick={handleSaveQuotation} className="btn btn-success">
            💾 Save Quotation
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Project Selector */}
      <div className="costing-list-filters">
        <div className="field">
          <label>Select Project Code:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="filter-select"
          >
            {projectCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotation Table */}
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>SKU (ML)</th>
              <th style={{ textAlign: 'right' }}>Unit Price (₹)</th>
              <th style={{ textAlign: 'center' }}>Quantity</th>
              <th style={{ textAlign: 'right' }}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredCostings.map((costing, index) => (
              <tr key={costing.id}>
                <td>{index + 1}</td>
                <td className="strong">{costing.product_name}</td>
                <td>{costing.sku_ml || "-"}</td>
                <td style={{ textAlign: 'right' }}>
                  ₹ {(parseFloat(costing.final_unit_price) || 0).toFixed(2)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="number"
                    value={quantities[costing.id] || 0}
                    onChange={(e) => handleQuantityChange(costing.id, e.target.value)}
                    min="0"
                    className="form-input"
                    style={{ width: '100px', textAlign: 'center' }}
                  />
                </td>
                <td style={{ textAlign: 'right' }} className="strong">
                  ₹ {calculateRowTotal(costing).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: '700', fontSize: '1.1em' }}>
              <td colSpan="5" style={{ textAlign: 'right' }}>
                Grand Total:
              </td>
              <td style={{ textAlign: 'right', color: '#3b82f6' }}>
                ₹ {calculateGrandTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary */}
      <div className="dashboard-quick-actions" style={{ marginTop: '20px' }}>
        <h3>Summary</h3>
        <div className="dashboard-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="dashboard-card">
            <h3>Project Code</h3>
            <p className="dashboard-card-number dashboard-card-number-blue">
              {selectedProject}
            </p>
          </div>
          <div className="dashboard-card">
            <h3>Total Items</h3>
            <p className="dashboard-card-number dashboard-card-number-green">
              {filteredCostings.length}
            </p>
          </div>
          <div className="dashboard-card">
            <h3>Total Quantity</h3>
            <p className="dashboard-card-number dashboard-card-number-blue">
              {Object.values(quantities).reduce((sum, qty) => sum + qty, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
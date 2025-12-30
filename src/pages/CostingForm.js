

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCosting } from "../api/api";
// import "./CostingForm.css";
import '../common.css';
export default function CostingForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    project_code: "",
    product_name: "",
    sku_ml: "",
    rm_per_litre: "",
    packaging_name: "",
    packaging_cost_manual: "",
    batch_size_kg: 500,
    gst_percent: 18,
    cc_pc: 12,
    vaince: 12,
    fda: 1,
    formulation_charge: 2,
    transport: 4,
    notes: "",
  });

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const save = async () => {
    if (!form.project_code.trim() || !form.product_name.trim()) {
      alert("Please enter Project Code and Product Name.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await createCosting(form, token);
      setLoading(false);
      alert("Costing created successfully.");
      navigate("/costings");
    } catch (err) {
      console.error("Save error:", err);
      setLoading(false);
      alert(err.response?.data?.detail || "Failed to save costing. Check console for details.");
    }
  };

  return (
    <div className="costing-form">
      <h1>Create New Costing</h1>

      <div className="grid">
        <div className="field">
          <label>Project Code</label>
          <input
            type="text"
            value={form.project_code}
            onChange={(e) => updateField("project_code", e.target.value)}
            placeholder="e.g. PROJ-2025-001"
          />
        </div>

        <div className="field">
          <label>Product Name</label>
          <input
            type="text"
            value={form.product_name}
            onChange={(e) => updateField("product_name", e.target.value)}
            placeholder="Product name"
          />
        </div>

        <div className="field">
          <label>SKU (ml)</label>
          <input
            type="number"
            value={form.sku_ml}
            onChange={(e) => updateField("sku_ml", e.target.value)}
            min="0"
          />
        </div>

        <div className="field">
          <label>RM Cost per Litre (₹)</label>
          <input
            type="number"
            value={form.rm_per_litre}
            onChange={(e) => updateField("rm_per_litre", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="full">
          <h3>Packaging Material (Manual Input)</h3>
        </div>

        <div className="full field">
          <label>Packaging Name</label>
          <input
            type="text"
            value={form.packaging_name}
            onChange={(e) => updateField("packaging_name", e.target.value)}
            placeholder="e.g. Bottle + Cap + Label"
          />
        </div>

        <div className="field">
          <label>Total Packaging Cost (₹)</label>
          <input
            type="number"
            value={form.packaging_cost_manual}
            onChange={(e) => updateField("packaging_cost_manual", e.target.value)}
            min="0"
            step="0.01"
            placeholder="Enter total cost of packaging"
          />
        </div>

        <div className="field">
          <label>Batch Size (KG)</label>
          <input
            type="number"
            value={form.batch_size_kg}
            onChange={(e) => updateField("batch_size_kg", e.target.value)}
            min="1"
          />
        </div>

        <div className="field">
          <label>CC / PC</label>
          <input
            type="number"
            value={form.cc_pc}
            onChange={(e) => updateField("cc_pc", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="field">
          <label>Vaince</label>
          <input
            type="number"
            value={form.vaince}
            onChange={(e) => updateField("vaince", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="field">
          <label>FDA</label>
          <input
            type="number"
            value={form.fda}
            onChange={(e) => updateField("fda", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="field">
          <label>Formulation Charge</label>
          <input
            type="number"
            value={form.formulation_charge}
            onChange={(e) => updateField("formulation_charge", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="field">
          <label>Transport</label>
          <input
            type="number"
            value={form.transport}
            onChange={(e) => updateField("transport", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="field">
          <label>GST %</label>
          <input
            type="number"
            value={form.gst_percent}
            onChange={(e) => updateField("gst_percent", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="full field">
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Any extra notes"
          />
        </div>
      </div>

      <div className="actions">
        <button className="save-btn" onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save Costing"}
        </button>
      </div>
    </div>
  );
}
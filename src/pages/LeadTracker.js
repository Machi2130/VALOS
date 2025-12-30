// // ============================================================================
// // LeadTracker.js - Updated without inline styles
// // ============================================================================

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./LeadTracker.css";

// const STATUSES = [
//   { key: "new", label: "New" },
//   { key: "contacted", label: "Contacted" },
//   { key: "qualified", label: "Qualified" },
//   { key: "converted", label: "Converted" },
//   { key: "lost", label: "Lost" },
// ];

// const PRIORITY_COLORS = {
//   high: "priority-high",
//   medium: "priority-medium",
//   low: "priority-low"
// };

// const DEFAULT_PRIORITY = "medium";

// const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export default function LeadTracker() {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     loadLeads();
//   }, []);

//   const filteredLeads = leads.filter((lead) => {
//     if (!searchTerm.trim()) return true;
//     const term = searchTerm.toLowerCase();
//     return (
//       (lead.company_name || "").toLowerCase().includes(term) ||
//       (lead.owner || "").toLowerCase().includes(term) ||
//       (lead.email || "").toLowerCase().includes(term) ||
//       (lead.project_code || "").toLowerCase().includes(term) ||
//       (lead.notes || "").toLowerCase().includes(term)
//     );
//   });

//   const loadLeads = async () => {
//     setLoading(true);
//     try {
//       console.log("📄 Loading leads...");
//       const res = await axios.get(`${API_BASE}/leads/?skip=0&limit=100`, {
//         headers: getAuthHeaders(),
//       });
      
//       console.log("📦 API Response:", res.data);
      
//       const leadData = res.data.items || [];
//       console.log("✅ Loaded", leadData.length, "leads");
      
//       setLeads(
//         leadData.map(lead => ({
//           ...lead,
//           priority: lead.priority || DEFAULT_PRIORITY
//         }))
//       );
//     } catch (err) {
//       console.error("❌ Failed to load leads:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDrop = async (leadId, newStatus) => {
//     try {
//       await axios.patch(
//         `${API_BASE}/leads/${leadId}/status/`,
//         { status: newStatus },
//         { headers: getAuthHeaders() }
//       );
//       setLeads((prev) =>
//         prev.map((l) =>
//           l.id === leadId ? { ...l, status: newStatus } : l
//         )
//       );
//     } catch (err) {
//       console.error("Failed to update status", err);
//     }
//   };

//   const cyclePriority = (leadId) => {
//     setLeads(prev =>
//       prev.map(l => {
//         if (l.id !== leadId) return l;

//         const priorities = ["high", "medium", "low"];
//         const currentIndex = priorities.indexOf(l.priority);
//         const nextIndex = (currentIndex + 1) % priorities.length;
        
//         return { 
//           ...l, 
//           priority: priorities[nextIndex] 
//         };
//       })
//     );
//   };

//   const handleDragStart = (event, leadId) => {
//     event.dataTransfer.setData("leadId", String(leadId));
//   };

//   const handleDrop = (event, newStatus) => {
//     event.preventDefault();
//     const leadId = parseInt(event.dataTransfer.getData("leadId"), 10);
//     if (leadId) {
//       onDrop(leadId, newStatus);
//     }
//   };

//   const allowDrop = (event) => event.preventDefault();

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <div className="loading-text">Loading leads...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="lead-tracker">
//       {/* Header */}
//       <div className="lead-tracker-header">
//         <div>
//           <h1>Lead Tracker</h1>
//           <div className="lead-tracker-stats">
//             Total: <strong>{filteredLeads.length}</strong> leads
//             {searchTerm && ` (filtered from ${leads.length})`}
//           </div>
//         </div>
//         <div className="lead-tracker-actions">
//           <input
//             type="text"
//             className="lead-search-input"
//             placeholder="Search by company, owner, project code..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button 
//             onClick={loadLeads}
//             disabled={loading}
//             className="btn btn-primary"
//           >
//             🔄 Refresh
//           </button>
//         </div>
//       </div>

//       {/* Columns */}
//       <div className="columns">
//         {STATUSES.map((col) => {
//           const columnLeads = filteredLeads.filter((l) => l.status === col.key);
          
//           return (
//             <div
//               key={col.key}
//               className="column"
//               onDragOver={allowDrop}
//               onDrop={(e) => handleDrop(e, col.key)}
//             >
//               {/* Column Header */}
//               <div className="column-header">
//                 <h3>{col.label}</h3>
//                 <div className="column-count">{columnLeads.length}</div>
//               </div>

//               {/* Cards */}
//               <div className="column-body">
//                 {columnLeads.length === 0 ? (
//                   <div className="column-empty">
//                     <div className="empty-icon">📥</div>
//                     Drop leads here
//                   </div>
//                 ) : (
//                   columnLeads.map((lead) => (
//                     <div
//                       key={lead.id}
//                       draggable
//                       onDragStart={(e) => handleDragStart(e, lead.id)}
//                       onClick={() => cyclePriority(lead.id)}
//                       className={`card ${PRIORITY_COLORS[lead.priority]}`}
//                       title={`Click to change priority\nCompany: ${lead.company_name}`}
//                     >
//                       {/* Priority Dot */}
//                       <div className={`priority-dot priority-dot-${lead.priority}`}></div>

//                       {/* Priority Label */}
//                       <div className="priority-label">
//                         {lead.priority.toUpperCase()}
//                       </div>

//                       {/* Content */}
//                       <div className="card-company">
//                         {lead.company_name}
//                       </div>
                      
//                       <div className="card-owner">
//                         {lead.owner}
//                       </div>

//                       {lead.project_code && (
//                         <div className="card-project-code">
//                           🏷️ {lead.project_code}
//                         </div>
//                       )}
                      
//                       {lead.email && (
//                         <div className="card-email" title={lead.email}>
//                           📧 {lead.email}
//                         </div>
//                       )}
                      
//                       {lead.notes && (
//                         <div className="card-notes">
//                           {lead.notes.length > 80 ? lead.notes.slice(0, 80) + '...' : lead.notes}
//                         </div>
//                       )}
                      
//                       <div className="card-hint">
//                         click to cycle priority
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LeadTracker.css";

const STATUSES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
];

const PRIORITY_COLORS = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low"
};

const DEFAULT_PRIORITY = "medium";

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function LeadTracker() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (lead.company_name || "").toLowerCase().includes(term) ||
      (lead.owner || "").toLowerCase().includes(term) ||
      (lead.email || "").toLowerCase().includes(term) ||
      (lead.project_code || "").toLowerCase().includes(term) ||
      (lead.notes || "").toLowerCase().includes(term)
    );
  });

  const loadLeads = async () => {
    setLoading(true);
    try {
      console.log("📄 Loading leads...");
      const res = await axios.get(`${API_BASE}/leads/?skip=0&limit=100`, {
        headers: getAuthHeaders(),
      });
      
      console.log("📦 API Response:", res.data);
      
      const leadData = res.data.items || [];
      console.log("✅ Loaded", leadData.length, "leads");
      
      setLeads(
        leadData.map(lead => ({
          ...lead,
          priority: lead.priority || DEFAULT_PRIORITY
        }))
      );
    } catch (err) {
      console.error("❌ Failed to load leads:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (leadId, newStatus) => {
    // Optimistically update UI first
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: newStatus } : l
      )
    );

    try {
      await axios.patch(
        `${API_BASE}/leads/${leadId}/status/`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      
      console.log("✅ Lead status updated successfully, broadcasting event...");
      
      // 🔔 Notify other components that leads have been updated
      window.dispatchEvent(new Event('leadsUpdated'));
    } catch (err) {
      console.error("❌ Failed to update status", err);
      // Revert optimistic update on error
      loadLeads();
    }
  };

  const cyclePriority = (leadId) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id !== leadId) return l;

        const priorities = ["high", "medium", "low"];
        const currentIndex = priorities.indexOf(l.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        
        return { 
          ...l, 
          priority: priorities[nextIndex] 
        };
      })
    );
  };

  const handleDragStart = (event, leadId) => {
    event.dataTransfer.setData("leadId", String(leadId));
  };

  const handleDrop = (event, newStatus) => {
    event.preventDefault();
    const leadId = parseInt(event.dataTransfer.getData("leadId"), 10);
    if (leadId) {
      onDrop(leadId, newStatus);
    }
  };

  const allowDrop = (event) => event.preventDefault();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="lead-tracker">
      {/* Header */}
      <div className="lead-tracker-header">
        <div>
          <h1>Lead Tracker</h1>
          <div className="lead-tracker-stats">
            Total: <strong>{filteredLeads.length}</strong> leads
            {searchTerm && ` (filtered from ${leads.length})`}
          </div>
        </div>
        <div className="lead-tracker-actions">
          <input
            type="text"
            className="lead-search-input"
            placeholder="Search by company, owner, project code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={loadLeads}
            disabled={loading}
            className="btn btn-primary"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="columns">
        {STATUSES.map((col) => {
          const columnLeads = filteredLeads.filter((l) => l.status === col.key);
          
          return (
            <div
              key={col.key}
              className="column"
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              {/* Column Header */}
              <div className="column-header">
                <h3>{col.label}</h3>
                <div className="column-count">{columnLeads.length}</div>
              </div>

              {/* Cards */}
              <div className="column-body">
                {columnLeads.length === 0 ? (
                  <div className="column-empty">
                    <div className="empty-icon">📥</div>
                    Drop leads here
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => cyclePriority(lead.id)}
                      className={`card ${PRIORITY_COLORS[lead.priority]}`}
                      title={`Click to change priority\nCompany: ${lead.company_name}`}
                    >
                      {/* Priority Dot */}
                      <div className={`priority-dot priority-dot-${lead.priority}`}></div>

                      {/* Priority Label */}
                      <div className="priority-label">
                        {lead.priority.toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="card-company">
                        {lead.company_name}
                      </div>
                      
                      <div className="card-owner">
                        {lead.owner}
                      </div>

                      {lead.project_code && (
                        <div className="card-project-code">
                          🏷️ {lead.project_code}
                        </div>
                      )}
                      
                      {lead.email && (
                        <div className="card-email" title={lead.email}>
                          📧 {lead.email}
                        </div>
                      )}
                      
                      {lead.notes && (
                        <div className="card-notes">
                          {lead.notes.length > 80 ? lead.notes.slice(0, 80) + '...' : lead.notes}
                        </div>
                      )}
                      
                      <div className="card-hint">
                        click to cycle priority
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

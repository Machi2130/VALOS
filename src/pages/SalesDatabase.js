import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSalesLeads, createLead, updateLead, deleteLead } from '../api/api';

// Sanitize payload before sending to backend
const sanitizeLeadPayload = (lead) => {
  const {
    id,
    created_at,
    updated_at,
    ...payload
  } = lead;

  // Remove null, undefined, and empty string values
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ''
    )
  );

  return cleanPayload;
};

export default function SalesDatabase() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [limit] = useState(50);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    location: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // ✅ FIXED: Include id in initial state
  const [formData, setFormData] = useState({
    id: null,
    company_name: '',
    owner: '',
    email: '',
    phone: '',
    status: 'new',
    location: '',
    segment: '',
    project_code: '',
    notes: ''
  });

  // Fetch leads
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['sales-leads', page, limit, filters],
    queryFn: () =>
      getSalesLeads({
        skip: page * limit,
        limit,
        search: filters.search || '',
        status: filters.status || '',
        location: filters.location || '',
      }),
    keepPreviousData: true,
  });

  // ✅ SINGLE UNIFIED MUTATION - FIXED
  const saveMutation = useMutation({
    mutationFn: (lead) => {
      const cleanPayload = sanitizeLeadPayload(lead);
      
      // ✅ CORRECT: Decide based on DATA (lead.id), not UI state
      if (lead?.id) {
        return updateLead(lead.id, cleanPayload);
      }
      return createLead(cleanPayload);
    },
    onSuccess: (updatedLead, variables) => {
      queryClient.invalidateQueries(['sales-leads']);
      setShowModal(false);
      resetForm();
      
      const isUpdate = variables?.id;
      alert(isUpdate ? 'Lead updated!' : 'Lead created!');
    },
    onError: (error) => {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sales-leads']);
      closeProfile();
      alert('Lead deleted successfully');
    },
    onError: (error) => {
      alert('Error deleting lead: ' + error.message);
    }
  });

  // ✅ FIXED: Explicit id = null for CREATE mode
  const resetForm = () => {
    setFormData({
      id: null,
      company_name: '',
      owner: '',
      email: '',
      phone: '',
      status: 'new',
      location: '',
      segment: '',
      project_code: '',
      notes: ''
    });
  };

  // ✅ FIXED: Edit via modal only
  const handleEdit = (lead) => {
    setFormData({
      id: lead.id,  // 🔒 CRITICAL: Keep ID
      company_name: lead.company_name || '',
      owner: lead.owner || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'new',
      location: lead.location || '',
      segment: lead.segment || '',
      project_code: lead.project_code || '',
      notes: lead.notes || ''
    });
    setSelectedLead(lead);
    setShowModal(true);
  };

  const openProfile = (lead) => {
    setSelectedLead(lead);
  };

  const closeProfile = () => {
    setSelectedLead(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  // ✅ OPTIONAL: Hard guard to catch ID bugs
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Safety check: if editing but ID is missing, block it
    if (showModal && !formData.id && selectedLead) {
      alert("BUG: Editing without ID — blocked");
      return;
    }

    saveMutation.mutate(formData);
  };

  const leads = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = data?.has_more || false;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="sales-db">
      {/* Header */}
      <div className="sales-db-header">
        <h1>Sales Leads Database</h1>
        <button
          onClick={() => {
            resetForm();  // ✅ id = null → CREATE mode
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="sales-db-filters">
        <input
          type="text"
          placeholder="Search by company, owner, project code..."
          value={filters.search}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, search: e.target.value }));
            setPage(0);
          }}
          className="sales-search"
        />

        <select
          value={filters.status}
          onChange={(e) => {
            setFilters(prev => ({ ...prev, status: e.target.value }));
            setPage(0);
          }}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Stats */}
      <div className="sales-db-stats">
        Showing {leads.length} of {total} leads
      </div>

      {/* Loading */}
      {isLoading && <div className="text-center loading-text">Loading...</div>}

      {/* Error */}
      {isError && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Project Code</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map(lead => (
                    <tr key={lead.id}>
                      <td className="strong">
                        <span 
                          className="company-link"
                          onClick={() => openProfile(lead)}
                        >
                          {lead.company_name}
                        </span>
                      </td>
                      <td>{lead.project_code || '-'}</td>
                      <td>{lead.owner}</td>
                      <td>{lead.email || '-'}</td>
                      <td>{lead.phone || '-'}</td>
                      <td>
                        <span className={`status-badge status-${lead.status}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>{lead.location || '-'}</td>
                      <td className="notes">
                        <span title={lead.notes || ''}>
                          {lead.notes 
                            ? (lead.notes.length > 40 
                                ? lead.notes.slice(0, 40) + '…' 
                                : lead.notes)
                            : '-'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="btn btn-small btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="btn btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span className="pagination-info">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Profile Panel - READ ONLY (No Edit Button) */}
      {selectedLead && (
        <div className="profile-overlay" onClick={(e) => {
          if (e.target.className === 'profile-overlay') {
            closeProfile();
          }
        }}>
          <div className="profile-panel">
            <div className="profile-header">
              <h2>Company Profile</h2>
              <button 
                className="profile-close-btn" 
                onClick={closeProfile}
              >
                ×
              </button>
            </div>

            <div className="profile-body">
              <div className="profile-field">
                <label>Company Name</label>
                <p className="profile-value">{selectedLead.company_name}</p>
              </div>

              <div className="profile-field">
                <label>Owner</label>
                <p className="profile-value">{selectedLead.owner || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <p className="profile-value">{selectedLead.email || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Phone</label>
                <p className="profile-value">{selectedLead.phone || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Website</label>
                <p className="profile-value">{selectedLead.website || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Status</label>
                <span className={`status-badge status-${selectedLead.status}`}>
                  {selectedLead.status}
                </span>
              </div>

              <div className="profile-field">
                <label>Location</label>
                <p className="profile-value">{selectedLead.location || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Segment</label>
                <p className="profile-value">{selectedLead.segment || '-'}</p>
              </div>

              <div className="profile-field">
                <label>POC</label>
                <p className="profile-value">{selectedLead.poc || '-'}</p>
              </div>

              <div className="profile-field">
                <label>POC Email</label>
                <p className="profile-value">{selectedLead.poc_email || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Project Code</label>
                <p className="profile-value">{selectedLead.project_code || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Founding Year</label>
                <p className="profile-value">{selectedLead.founding_year || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Funding Status</label>
                <p className="profile-value">{selectedLead.funding_status || '-'}</p>
              </div>

              <div className="profile-field">
                <label>Notes</label>
                <p className="profile-value profile-notes">{selectedLead.notes || '-'}</p>
              </div>
            </div>

            {/* ✅ ONLY DELETE BUTTON - NO EDIT */}
            <div className="profile-actions">
              <button 
                type="button"
                className="btn btn-danger" 
                onClick={() => {
                  if (window.confirm('Delete this lead?')) {
                    deleteMutation.mutate(selectedLead.id);
                    closeProfile();
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - ONLY WAY TO EDIT */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            setShowModal(false);
            resetForm();
          }
        }}>
          <div className="modal-content">
            <h2>{formData.id ? 'Edit Lead' : 'New Lead'}</h2>
            <div>
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
                className="form-input"
              />
              <input
                type="text"
                placeholder="Owner *"
                value={formData.owner || ''}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                required
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
              <select
                value={formData.status || 'new'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-input"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Segment"
                value={formData.segment || ''}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Project Code"
                value={formData.project_code || ''}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                className="form-input"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-input form-textarea"
                rows={3}
              />
              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary" 
                  disabled={saveMutation.isLoading}
                >
                  {saveMutation.isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

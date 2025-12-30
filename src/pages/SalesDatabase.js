// ============================================================================
// SalesDatabase.js - Updated without inline styles
// ============================================================================

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSalesLeads, createLead, updateLead, deleteLead } from '../api/api';

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
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
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

  const saveMutation = useMutation({
    mutationFn: (lead) => {
      if (editingLead) {
        return updateLead(editingLead.id, lead);
      }
      return createLead(lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      setShowModal(false);
      resetForm();
      alert(editingLead ? 'Lead updated!' : 'Lead created!');
    },
    onError: (error) => {
      alert('Error: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      alert('Lead deleted successfully');
    }
  });

  const resetForm = () => {
    setFormData({
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
    setEditingLead(null);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setShowModal(true);
  };

  const openProfile = (lead) => {
    setSelectedLead(lead);
    setProfileData({ ...lead });
    setIsEditingProfile(false);
  };

  const closeProfile = () => {
    setSelectedLead(null);
    setProfileData(null);
    setIsEditingProfile(false);
  };

  const handleProfileSave = () => {
    saveMutation.mutate(profileData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['sales-leads']);
        setSelectedLead(profileData);
        setIsEditingProfile(false);
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
            resetForm();
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

      {/* Profile Panel */}
      {selectedLead && (
        <div className="profile-overlay">
          <div className="profile-panel">
            <div className="profile-header">
              <h2>{isEditingProfile ? 'Edit Profile' : 'Company Profile'}</h2>
              <button className="profile-close-btn" onClick={closeProfile}>×</button>
            </div>
            
            <div className="profile-body">
              <div className="profile-field">
                <label>Company Name</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.company_name}
                    onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.company_name}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Owner</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.owner}
                    onChange={(e) => setProfileData({ ...profileData, owner: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.owner || '-'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Email</label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.email || '-'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Phone</label>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.phone || '-'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Status</label>
                {isEditingProfile ? (
                  <select
                    className="form-input"
                    value={profileData.status}
                    onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                ) : (
                  <span className={`status-badge status-${selectedLead.status}`}>
                    {selectedLead.status}
                  </span>
                )}
              </div>

              <div className="profile-field">
                <label>Location</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.location || '-'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Segment</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.segment}
                    onChange={(e) => setProfileData({ ...profileData, segment: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.segment || '-'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Project Code</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.project_code || ''}
                    onChange={(e) => setProfileData({ ...profileData, project_code: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{selectedLead.project_code || '-'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Notes</label>
                {isEditingProfile ? (
                  <textarea
                    className="form-input form-textarea"
                    value={profileData.notes}
                    onChange={(e) => setProfileData({ ...profileData, notes: e.target.value })}
                  />
                ) : (
                  <p className="profile-value profile-notes">{selectedLead.notes || '-'}</p>
                )}
              </div>
            </div>

            <div className="profile-actions">
              {isEditingProfile ? (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleProfileSave}
                    disabled={saveMutation.isLoading}
                  >
                    {saveMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setProfileData({ ...selectedLead });
                      setIsEditingProfile(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit Profile
                  </button>
                  <button 
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
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingLead ? 'Edit Lead' : 'New Lead'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
                className="form-input"
              />
              <input
                type="text"
                placeholder="Owner *"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                required
                className="form-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
              <select
                value={formData.status}
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
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Segment"
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Project Code"
                value={formData.project_code}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                className="form-input"
              />
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-input form-textarea"
              />
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={saveMutation.isLoading}>
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

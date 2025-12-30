
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCostings, deleteCosting, duplicateCosting, updateCosting } from '../api/api';
import { useNavigate } from 'react-router-dom';
import "../common.css";

export default function CostingList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Pagination and filter state
  const [page, setPage] = useState(0);
  const [limit] = useState(50);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    project_code: ''
  });

  // Profile modal state
  const [selectedCosting, setSelectedCosting] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch costings with React Query
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    isFetching 
  } = useQuery({
    queryKey: ['costings', page, limit, filters],
    queryFn: () => getCostings({
      skip: page * limit,
      limit,
      search: filters.search,
      status: filters.status,
      project_code: filters.project_code
    }),
    keepPreviousData: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCosting,
    onSuccess: () => {
      queryClient.invalidateQueries(['costings']);
      alert('Costing deleted successfully');
    },
    onError: (error) => {
      alert('Failed to delete: ' + error.message);
    }
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: duplicateCosting,
    onSuccess: () => {
      queryClient.invalidateQueries(['costings']);
      alert('Costing duplicated successfully');
    },
    onError: (error) => {
      alert('Failed to duplicate: ' + error.message);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this costing?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (id) => {
    duplicateMutation.mutate(id);
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCosting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['costings']);
      setIsEditing(false);
    },
    onError: (error) => {
      alert('Failed to update: ' + error.message);
    }
  });

  const openProfile = (costing) => {
    setSelectedCosting(costing);
    setProfileData({ ...costing });
    setIsEditing(false);
  };

  const closeProfile = () => {
    setSelectedCosting(null);
    setProfileData(null);
    setIsEditing(false);
  };

  const handleProfileSave = () => {
    updateMutation.mutate({ id: profileData.id, data: profileData });
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
    setPage(0);
  };

  const costings = data?.items || [];
  const total = data?.total || 0;
  const hasMore = data?.has_more || false;
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20 
      }}>
        <h1>Costings</h1>
        <button
          onClick={() => navigate('/costing/new')}
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          + New Costing
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: 10, 
        marginBottom: 20,
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by product name or project code..."
          value={filters.search}
          onChange={handleSearchChange}
          style={{
            flex: 1,
            minWidth: 200,
            padding: 8,
            border: '1px solid #d1d5db',
            borderRadius: 4
          }}
        />
        
        <select
          value={filters.status}
          onChange={handleStatusChange}
          style={{
            padding: 8,
            border: '1px solid #d1d5db',
            borderRadius: 4
          }}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ 
        marginBottom: 20, 
        color: '#6b7280',
        fontSize: 14 
      }}>
        Showing {costings.length} of {total} costings
        {isFetching && <span style={{ marginLeft: 10 }}>🔄 Updating...</span>}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div>Loading costings...</div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div style={{ 
          padding: 20, 
          background: '#fee2e2', 
          color: '#b91c1c',
          borderRadius: 4 
        }}>
          Error loading costings: {error.message}
        </div>
      )}

      {/* Costings Table */}
      {!isLoading && !isError && (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Project Code</th>
                  <th style={thStyle}>Product Name</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>SKU (ml)</th>
                  <th style={thStyle}>Final Price</th>
                  <th style={thStyle}>MOQ</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {costings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: 40 }}>
                      No costings found. Create your first one!
                    </td>
                  </tr>
                ) : (
                  costings.map((costing) => (
                    <tr key={costing.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={tdStyle}>{costing.id}</td>
                      <td style={tdStyle}>
                        <span 
                          className="company-link"
                          style={{ color: 'white' }}
                          onClick={() => openProfile(costing)}
                        >
                          <strong>{costing.project_code}</strong>
                        </span>
                      </td>
                      <td style={tdStyle}>{costing.product_name}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          background: costing.status === 'approved' ? '#d1fae5' : '#fee2e2',
                          color: costing.status === 'approved' ? '#065f46' : '#b91c1c'
                        }}>
                          {costing.status}
                        </span>
                      </td>
                      <td style={tdStyle}>{costing.sku_ml || '-'}</td>
                      <td style={tdStyle}>
                        ₹{Number(costing.final_unit_price || 0).toFixed(2)}
                      </td>
                      <td style={tdStyle}>{costing.moq || '-'}</td>
                      <td style={tdStyle}>
                        {new Date(costing.created_at).toLocaleDateString()}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button
                            onClick={() => {
                              openProfile(costing);
                              setIsEditing(true);
                            }}
                            style={actionButtonStyle}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicate(costing.id)}
                            disabled={duplicateMutation.isLoading}
                            style={actionButtonStyle}
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleDelete(costing.id)}
                            disabled={deleteMutation.isLoading}
                            style={{ ...actionButtonStyle, background: '#dc2626' }}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 10,
              marginTop: 20 
            }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={paginationButtonStyle}
              >
                Previous
              </button>
              
              <span style={{ color: '#6b7280' }}>
                Page {page + 1} of {totalPages}
              </span>
              
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                style={paginationButtonStyle}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Full Screen Profile Modal */}
      {selectedCosting && (
        <div className="fullscreen-profile-overlay">
          <div className="fullscreen-profile-modal">
            <div className="fullscreen-profile-header">
              <h2>{isEditing ? 'Edit Costing' : 'Costing Details'}</h2>
              <button className="profile-close-btn" onClick={closeProfile}>×</button>
            </div>
            
            <div className="fullscreen-profile-body">
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Project Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.project_code || ''}
                      onChange={(e) => setProfileData({ ...profileData, project_code: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">{selectedCosting.project_code}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Product Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.product_name || ''}
                      onChange={(e) => setProfileData({ ...profileData, product_name: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">{selectedCosting.product_name || '-'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Status</label>
                  {isEditing ? (
                    <select
                      className="form-input"
                      value={profileData.status || 'draft'}
                      onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <span className={`status-badge status-${selectedCosting.status}`}>
                      {selectedCosting.status}
                    </span>
                  )}
                </div>

                <div className="profile-field">
                  <label>SKU (ml)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-input"
                      value={profileData.sku_ml || ''}
                      onChange={(e) => setProfileData({ ...profileData, sku_ml: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">{selectedCosting.sku_ml || '-'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Final Price (₹)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={profileData.final_unit_price || ''}
                      onChange={(e) => setProfileData({ ...profileData, final_unit_price: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">₹{Number(selectedCosting.final_unit_price || 0).toFixed(2)}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>MOQ</label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="form-input"
                      value={profileData.moq || ''}
                      onChange={(e) => setProfileData({ ...profileData, moq: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">{selectedCosting.moq || '-'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Bottle Cost</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={profileData.bottle_cost || ''}
                      onChange={(e) => setProfileData({ ...profileData, bottle_cost: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">₹{Number(selectedCosting.bottle_cost || 0).toFixed(2)}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Cap Cost</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={profileData.cap_cost || ''}
                      onChange={(e) => setProfileData({ ...profileData, cap_cost: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">₹{Number(selectedCosting.cap_cost || 0).toFixed(2)}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Box Cost</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={profileData.box_cost || ''}
                      onChange={(e) => setProfileData({ ...profileData, box_cost: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">₹{Number(selectedCosting.box_cost || 0).toFixed(2)}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Label Cost</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={profileData.label_cost || ''}
                      onChange={(e) => setProfileData({ ...profileData, label_cost: e.target.value })}
                    />
                  ) : (
                    <p className="profile-value">₹{Number(selectedCosting.label_cost || 0).toFixed(2)}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Created At</label>
                  <p className="profile-value">
                    {new Date(selectedCosting.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="profile-field">
                  <label>Updated At</label>
                  <p className="profile-value">
                    {selectedCosting.updated_at ? new Date(selectedCosting.updated_at).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="fullscreen-profile-actions">
              {isEditing ? (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleProfileSave}
                    disabled={updateMutation.isLoading}
                  >
                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setProfileData({ ...selectedCosting });
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate(`/costing/${selectedCosting.id}`)}
                  >
                    View Full Details
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => {
                      if (window.confirm('Delete this costing?')) {
                        deleteMutation.mutate(selectedCosting.id);
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
    </div>
  );
}

// Styles
const thStyle = {
  padding: 12,
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 14,
  color: '#374151'
};

const tdStyle = {
  padding: 12,
  fontSize: 14,
  color: '#1f2937'
};

const actionButtonStyle = {
  padding: '6px 12px',
  fontSize: 12,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  background: '#2563eb',
  color: 'white'
};

const paginationButtonStyle = {
  padding: '8px 16px',
  border: '1px solid #d1d5db',
  borderRadius: 4,
  background: 'white',
  cursor: 'pointer',
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

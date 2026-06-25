import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cameraService } from '../../services/cameraService';
import AddCamera from '../add-camera/AddCamera';
import CameraDetails from '../camera-details/CameraDetails';
import ConfigurationHub from '../../../../Shared/ConfigureHub/ConfigurationHub';
import './CameraDashboard.css';

const statusOptions = ['All Status', 'Online', 'Offline'];

const locationOptions = [
  'All Locations',
  'Unit 1, Building A, Ground Floor',
  'Unit 1, Building A, 1st Floor',
  'Unit 2, Building B, Ground Floor',
  'Unit 3, Building C, Ground Floor',
  'Unit 3, Building C, 1st Floor'
];

const typeOptions = ['Camera Type', 'Fixed', 'PTZ'];

const actionOptions = [
  'Configure',
  'Update',
  'Delete'
];

export default function CameraDashboard() {
  const navigate = useNavigate();
  const [activeDrawer, setActiveDrawer] = useState(null); // 'add' | 'details' | null
  const [cameraToConfigure, setCameraToConfigure] = useState(null);

  const [cameras, setCameras] = useState(() => cameraService.getCameras());
  const [toast, setToast] = useState({ message: null, type: 'success' });
  const [deletingCameras, setDeletingCameras] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedCameraIds, setSelectedCameraIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedType, setSelectedType] = useState('Camera Type');
  const [selectedAction, setSelectedAction] = useState('Action');

  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('All Status');
  const [appliedLocation, setAppliedLocation] = useState('All Locations');
  const [appliedType, setAppliedType] = useState('Camera Type');
  const [appliedAction, setAppliedAction] = useState('Action');

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [typeSearchQuery, setTypeSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = cameraService.subscribe((updatedList) => {
      setCameras(updatedList);
    });

    const unsubscribeToast = cameraService.subscribeToast((toastState) => {
      setToast(toastState);
    });

    return () => {
      unsubscribe();
      unsubscribeToast();
    };
  }, []);

  const totalCount = Array.isArray(cameras) ? cameras.length : 0;
  const onlineCount = Array.isArray(cameras)
    ? cameras.filter((c) => c.status === 'Online').length
    : 0;
  const offlineCount = Array.isArray(cameras)
    ? cameras.filter((c) => c.status === 'Offline').length
    : 0;

  const onlinePercent =
    totalCount === 0 ? '0.0' : ((onlineCount / totalCount) * 100).toFixed(1);

  const offlinePercent =
    totalCount === 0 ? '0.0' : ((offlineCount / totalCount) * 100).toFixed(1);



  const filteredLocationOptions = useMemo(() => {
    const q = locationSearchQuery.toLowerCase();
    return locationOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [locationSearchQuery]);

  const filteredTypeOptions = useMemo(() => {
    const q = typeSearchQuery.toLowerCase();
    return typeOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [typeSearchQuery]);

  const filteredCameras = useMemo(() => {
    const list = Array.isArray(cameras) ? cameras : [];
    const query = appliedSearchQuery.trim().toLowerCase();
    const status = appliedStatus;
    const location = appliedLocation;
    const type = appliedType;

    return list.filter((camera) => {
      const matchesSearch =
        !query ||
        camera.name.toLowerCase().includes(query) ||
        camera.location.toLowerCase().includes(query) ||
        camera.id.toLowerCase().includes(query);

      const matchesStatus =
        status === 'All Status' || camera.status === status;

      const matchesLocation =
        location === 'All Locations' || camera.location === location;

      const matchesType =
        type === 'Camera Type' || camera.type === type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesType
      );
    });
  }, [
    cameras,
    appliedSearchQuery,
    appliedStatus,
    appliedLocation,
    appliedType
  ]);

  const processedCameras = useMemo(() => {
    const list = [...filteredCameras];

    switch (appliedAction) {
      case 'Name A-Z':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'Name Z-A':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'Online First':
        return list.sort((a, b) => {
          if (a.status === b.status) return a.name.localeCompare(b.name);
          return a.status === 'Online' ? -1 : 1;
        });
      case 'Offline First':
        return list.sort((a, b) => {
          if (a.status === b.status) return a.name.localeCompare(b.name);
          return a.status === 'Offline' ? -1 : 1;
        });
      default:
        return list;
    }
  }, [filteredCameras, appliedAction]);

  const totalPages = Math.max(1, Math.ceil(processedCameras.length / itemsPerPage));

  const activePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedCameras = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return processedCameras.slice(startIndex, startIndex + itemsPerPage);
  }, [processedCameras, activePage]);

  const showingStart =
    processedCameras.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(activePage * itemsPerPage, processedCameras.length);

  const paginationRange = useMemo(() => {
    const total = totalPages;
    const range = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
    } else {
      if (activePage <= 3) {
        range.push(1, 2, 3, '...', total);
      } else if (activePage >= total - 2) {
        range.push(1, '...', total - 2, total - 1, total);
      } else {
        range.push(1, '...', activePage, '...', total);
      }
    }

    return range;
  }, [activePage, totalPages]);

  const closeAllDropdowns = () => {
    setIsStatusDropdownOpen(false);
    setIsLocationDropdownOpen(false);
    setIsTypeDropdownOpen(false);
    setIsActionDropdownOpen(false);
    setLocationSearchQuery('');
    setTypeSearchQuery('');
  };

  const applyFilters = () => {
    setAppliedSearchQuery(searchQuery);
    setAppliedStatus(selectedStatus);
    setAppliedLocation(selectedLocation);
    setAppliedType(selectedType);
    setAppliedAction(selectedAction);
    setCurrentPage(1);
    closeAllDropdowns();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All Status');
    setSelectedLocation('All Locations');
    setSelectedType('Camera Type');
    setSelectedAction('Action');

    setAppliedSearchQuery('');
    setAppliedStatus('All Status');
    setAppliedLocation('All Locations');
    setAppliedType('Camera Type');
    setAppliedAction('Action');

    setCurrentPage(1);
    closeAllDropdowns();
    setShowCheckboxes(false);
    setSelectedCameraIds([]);
  };

  const refreshGrid = () => {
    resetFilters();
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const toggleStatusDropdown = (event) => {
    event.stopPropagation();
    const prev = isStatusDropdownOpen;
    closeAllDropdowns();
    setIsStatusDropdownOpen(!prev);
  };

  const toggleLocationDropdown = (event) => {
    event.stopPropagation();
    const prev = isLocationDropdownOpen;
    closeAllDropdowns();
    setIsLocationDropdownOpen(!prev);
  };

  const toggleTypeDropdown = (event) => {
    event.stopPropagation();
    const prev = isTypeDropdownOpen;
    closeAllDropdowns();
    setIsTypeDropdownOpen(!prev);
  };

  const toggleActionDropdown = (event) => {
    event.stopPropagation();
    const prev = isActionDropdownOpen;
    closeAllDropdowns();
    setIsActionDropdownOpen(!prev);
    setShowCheckboxes(true);
  };

  const selectStatus = (value) => {
    setSelectedStatus(value);
    setIsStatusDropdownOpen(false);
  };

  const selectLocation = (value) => {
    setSelectedLocation(value);
    setIsLocationDropdownOpen(false);
  };

  const selectType = (value) => {
    setSelectedType(value);
    setIsTypeDropdownOpen(false);
  };

  const selectAction = (value) => {
    if (value === 'Configure') {
      if (selectedCameraIds.length === 0) {
        cameraService.showToast('Please select at least one camera to configure', 'danger');
      } else if (selectedCameraIds.length > 1) {
        cameraService.showToast('Please select only one camera to configure', 'danger');
      } else {
        const selectedId = selectedCameraIds[0];
        const cameraToConfigureObj = cameras.find((c) => c.id === selectedId);
        if (cameraToConfigureObj) {
          setCameraToConfigure(cameraToConfigureObj);
          setShowCheckboxes(false);
          setSelectedCameraIds([]);
          setActiveDrawer('config');
        }
      }
      setIsActionDropdownOpen(false);
      return;
    }

    if (value === 'Delete') {
      if (selectedCameraIds.length === 0) {
        cameraService.showToast('Please select at least one camera to delete', 'danger');
      } else {
        const selectedCams = cameras.filter((c) => selectedCameraIds.includes(c.id));
        setDeletingCameras(selectedCams);
      }
      setIsActionDropdownOpen(false);
      return;
    }

    if (value === 'Update') {
      if (selectedCameraIds.length === 0) {
        cameraService.showToast('Please select at least one camera to update', 'danger');
      } else if (selectedCameraIds.length > 1) {
        cameraService.showToast('Please select only one camera to update', 'danger');
      } else {
        const selectedId = selectedCameraIds[0];
        const cameraToUpdate = cameras.find((c) => c.id === selectedId);
        if (cameraToUpdate) {
          cameraService.setEditingCamera(cameraToUpdate);
          setShowCheckboxes(false);
          setSelectedCameraIds([]);
          setActiveDrawer('details');
        }
      }
      setIsActionDropdownOpen(false);
      return;
    }

    setSelectedAction(value);
    setIsActionDropdownOpen(false);
  };



  const confirmDeleteCameras = () => {
    if (deletingCameras) {
      const ids = deletingCameras.map((c) => c.id);
      cameraService.deleteCameras(ids);
      setSelectedCameraIds([]);
      setDeletingCameras(null);
      setShowCheckboxes(false);
    }
  };

  const handleCloseToast = () => {
    cameraService.showToast(null);
  };

  return (
    <div className="camera-dashboard-host" onClick={closeAllDropdowns}>
      {toast.message && (
        <div className="toast-floating-container">
          <div className={`toast-alert-card toast-${toast.type}`}>
            <div className="toast-icon-box">
              {toast.type === 'success' ? '✓' : toast.type === 'danger' ? '✗' : 'ℹ'}
            </div>
            <span className="toast-message-text">{toast.message}</span>
            <button className="btn-toast-close" onClick={handleCloseToast}>
              ×
            </button>
          </div>
        </div>
      )}



      {deletingCameras && deletingCameras.length > 0 && (
        <div
          className="modal-backdrop-overlay"
          onClick={() => setDeletingCameras(null)}
        >
          <div
            className="delete-template-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-template-icon-wrapper">
              <div className="delete-template-icon-circle">
                <div className="delete-template-icon-inner-circle">
                  !
                </div>
              </div>
            </div>

            <h3 className="delete-template-title">Delete Camera</h3>

            <div className="delete-template-description">
              <p>Are you sure you want to delete this Camera?</p>
              <p>This action cannot be undone!.</p>
            </div>

            <div className="delete-cameras-list" style={{ textAlign: 'left', maxHeight: '100px', overflowY: 'auto', marginBottom: '24px', padding: '10px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <span style={{ fontWeight: '600', display: 'block', marginBottom: '4px', color: '#475569' }}>Selected Camera(s):</span>
              {deletingCameras.map(cam => (
                <div key={cam.id} style={{ padding: '2px 0' }}>
                  • <strong>{cam.name}</strong> ({cam.id})
                </div>
              ))}
            </div>

            <div className="delete-template-btn-row">
              <button
                className="btn-delete-template-cancel"
                onClick={() => setDeletingCameras(null)}
              >
                Cancel
              </button>
              <button
                className="btn-delete-template-confirm"
                onClick={confirmDeleteCameras}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Small inner section header */}
      <div className="camera-section-header">
        <div className="camera-section-title-wrap">
          <h2 className="camera-section-title">Camera List</h2>
        </div>

        <button className="btn-add-camera" onClick={() => setActiveDrawer('add')}>
          <span className="plus-icon">+</span>
          Add Camera
        </button>
      </div>

      {/* Metric cards */}
      <div className="metrics-cards-row">
        <div className="metric-card">
          <div className="card-chart-icon">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <circle cx="16" cy="16" r="14" fill="#62c47b" />
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Cameras</span>
            <span className="metric-value">{totalCount}</span>
            <span className="metric-subtext">All Locations</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-chart-icon">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <circle cx="16" cy="16" r="14" fill="#62c47b" />
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Online</span>
            <span className="metric-value">{onlineCount}</span>
            <span className="metric-subtext">{onlinePercent}%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="card-chart-icon">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <circle cx="16" cy="16" r="14" fill="#62c47b" />
            </svg>
          </div>
          <div className="metric-details">
            <span className="metric-label">Offline</span>
            <span className="metric-value">{offlineCount}</span>
            <span className="metric-subtext">{offlinePercent}%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="filters-card-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="filters-row">
          <div className="search-input-container">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>

            <input
              type="text"
              className="search-bar"
              placeholder="Search Cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-dropdown-container">
            <div className="custom-filter-dropdown" onClick={toggleStatusDropdown}>
              <div className="dropdown-selected-box">
                <span>{selectedStatus}</span>
                <span className="chevron-arrow">▼</span>
              </div>

              {isStatusDropdownOpen && (
                <div className="dropdown-overlay-options">
                  {statusOptions.map((item) => (
                    <div
                      key={item}
                      className="dropdown-option-item"
                      onClick={() => selectStatus(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="filter-dropdown-container location-filter">
            <div className="custom-filter-dropdown" onClick={toggleLocationDropdown}>
              <div className="dropdown-selected-box">
                <span>{selectedLocation}</span>
                <span className="chevron-arrow">▼</span>
              </div>

              {isLocationDropdownOpen && (
                <div className="dropdown-overlay-options">
                  <div className="dropdown-search-wrapper" onClick={(e) => e.stopPropagation()}>
                    <img
                      src="/assets/icon_search.png"
                      alt="Search"
                      className="dropdown-search-icon"
                    />
                    <input
                      type="text"
                      className="dropdown-search-input"
                      placeholder="Search..."
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                    />
                  </div>

                  {filteredLocationOptions.map((item) => (
                    <div
                      key={item}
                      className="dropdown-option-item"
                      onClick={() => selectLocation(item)}
                    >
                      {item}
                    </div>
                  ))}

                  {filteredLocationOptions.length === 0 && (
                    <div className="no-results-item">No locations found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="filter-dropdown-container">
            <div className="custom-filter-dropdown" onClick={toggleTypeDropdown}>
              <div className="dropdown-selected-box">
                <span>{selectedType}</span>
                <span className="chevron-arrow">▼</span>
              </div>

              {isTypeDropdownOpen && (
                <div className="dropdown-overlay-options">
                  <div className="dropdown-search-wrapper" onClick={(e) => e.stopPropagation()}>
                    <img
                      src="/assets/icon_search.png"
                      alt="Search"
                      className="dropdown-search-icon"
                    />
                    <input
                      type="text"
                      className="dropdown-search-input"
                      placeholder="Search..."
                      value={typeSearchQuery}
                      onChange={(e) => setTypeSearchQuery(e.target.value)}
                    />
                  </div>

                  {filteredTypeOptions.map((item) => (
                    <div
                      key={item}
                      className="dropdown-option-item"
                      onClick={() => selectType(item)}
                    >
                      {item}
                    </div>
                  ))}

                  {filteredTypeOptions.length === 0 && (
                    <div className="no-results-item">No types found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button className="btn-apply" onClick={applyFilters}>
            Apply Filter
          </button>

          <button
            className="btn-refresh-box"
            onClick={refreshGrid}
            aria-label="Refresh grid"
          >
            <svg
              className="refresh-icon"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
          </button>

          <div className="filter-dropdown-container action-filter">
            <div className="custom-filter-dropdown" onClick={toggleActionDropdown}>
              <div className="dropdown-selected-box">
                <span>{selectedAction}</span>
                <span className="chevron-arrow">▼</span>
              </div>

              {isActionDropdownOpen && (
                <div className="dropdown-overlay-options">
                  {actionOptions.map((item) => (
                    <div
                      key={item}
                      className="dropdown-option-item"
                      onClick={() => selectAction(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="data-table-card">
        <div className="table-outer-wrapper">
          <table className="cameras-data-table">
            <thead>
              <tr>
                {showCheckboxes && (
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        paginatedCameras.length > 0 &&
                        paginatedCameras.every((cam) => selectedCameraIds.includes(cam.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const pageIds = paginatedCameras.map((cam) => cam.id);
                          setSelectedCameraIds((prev) => Array.from(new Set([...prev, ...pageIds])));
                        } else {
                          const pageIds = paginatedCameras.map((cam) => cam.id);
                          setSelectedCameraIds((prev) => prev.filter((id) => !pageIds.includes(id)));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                )}
                <th className="col-id">Camera ID</th>
                <th className="col-name">Camera Name</th>
                <th className="col-location">Location</th>
                <th className="col-status">Status</th>
                <th className="col-type">Type</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCameras.map((camera) => (
                <tr key={camera.id}>
                  {showCheckboxes && (
                    <td className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCameraIds.includes(camera.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCameraIds((prev) => [...prev, camera.id]);
                          } else {
                            setSelectedCameraIds((prev) => prev.filter((id) => id !== camera.id));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  <td className="col-id">
                    <button
                      className="camera-id-link"
                      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer', display: 'inline' }}
                      onClick={(e) => {
                        e.preventDefault();
                        cameraService.setEditingCamera(camera);
                        setActiveDrawer('details');
                      }}
                    >
                      {camera.id}
                    </button>
                  </td>
                  <td className="col-name cell-strong">{camera.name}</td>
                  <td className="col-location cell-muted">{camera.location}</td>
                  <td className="col-status">
                    <span
                      className={`status-indicator-pill ${
                        camera.status === 'Online' ? 'pill-online' : 'pill-offline'
                      }`}
                    >
                      <span className="status-indicator-dot"></span>
                      {camera.status}
                    </span>
                  </td>
                  <td className="col-type">{camera.type}</td>
                </tr>
              ))}

              {paginatedCameras.length === 0 && (
                <tr>
                  <td colSpan={showCheckboxes ? 7 : 6} className="empty-state-cell">
                    <div className="empty-message-container">
                      <svg
                        className="empty-icon"
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                      <h4 className="empty-title">No Camera Found</h4>
                      <p className="empty-desc">
                        Try resetting your filters or adding a new camera.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-controls">
          <span className="table-info-text">
            Showing <strong>{showingStart}</strong> to <strong>{showingEnd}</strong> of{' '}
            <strong>{processedCameras.length}</strong> entries
          </span>

          <nav className="pagination-navbar" aria-label="Table navigation">
            <button
              className="btn-pagination-arrow"
              disabled={activePage <= 1}
              onClick={prevPage}
            >
              ◀
            </button>

            {paginationRange.map((p, idx) =>
              p === '...' ? (
                <span key={idx} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  className={`btn-pagination-number ${p === activePage ? 'active-page' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="btn-pagination-arrow"
              disabled={activePage >= totalPages}
              onClick={nextPage}
            >
              ▶
            </button>
          </nav>
        </div>
      </div>

      {/* Sliding Drawer Container */}
      <div className={`drawer-overlay ${activeDrawer ? 'active' : ''}`} onClick={() => setActiveDrawer(null)}></div>
      <div className={`drawer-container ${activeDrawer ? 'active' : ''}`}>
        {activeDrawer && (
          <div className="drawer-content-scrollable">
            {activeDrawer === 'add' && <AddCamera onClose={() => setActiveDrawer(null)} />}
            {activeDrawer === 'details' && <CameraDetails onClose={() => setActiveDrawer(null)} />}
            {activeDrawer === 'config' && (
              <ConfigurationHub 
                camera={cameraToConfigure} 
                onClose={() => {
                  setActiveDrawer(null);
                  setCameraToConfigure(null);
                }} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
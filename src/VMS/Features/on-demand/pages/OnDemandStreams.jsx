import React, { useState, useMemo, useEffect } from "react";
import NewStreamSlider from "../components/NewStreamSlider";
import "./OnDemandStreams.css";

// Helper to format date
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[d.getMonth()];
  const day = d.getDate();
  const yr = d.getFullYear();
  const hr = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0');
  return `${m} ${day} ,${yr} ${hr}:${min}:${sec}`;
};

const statusOptions = ["All Status", "Completed", "Failed", "In Progress"];
const cameraOptions = [
  "All Camera",
  "Main Gate Camera",
  "Production Line 1",
  "Warehouse Entrance",
  "Parking Area Camera",
  "Dispatch Area"
];
const actionOptions = ["Configure", "Update", "Delete"];

export default function OnDemandStreams() {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  // Default requests
  const [requests, setRequests] = useState([
    {
      id: "ODR-2026-0001",
      camera: "Main Gate Camera",
      startDate: "May 14 ,2026 10:00:00",
      lastDate: "May 14 ,2026 10:00:00",
      duration: "01:00:00",
      resolution: "1080p",
      status: "Completed",
      requestedOn: "May 14 ,2026 10:00:00"
    },
    {
      id: "ODR-2026-0002",
      camera: "Production Line 1",
      startDate: "May 14 ,2026 10:00:00",
      lastDate: "May 14 ,2026 10:00:00",
      duration: "01:00:00",
      resolution: "1080p",
      status: "Completed",
      requestedOn: "May 14 ,2026 10:00:00"
    },
    {
      id: "ODR-2026-0003",
      camera: "Warehouse Entrance",
      startDate: "May 14 ,2026 10:00:00",
      lastDate: "May 14 ,2026 10:00:00",
      duration: "01:00:00",
      resolution: "1080p",
      status: "Failed",
      requestedOn: "May 14 ,2026 10:00:00"
    },
    {
      id: "ODR-2026-0004",
      camera: "Parking Area Camera",
      startDate: "May 14 ,2026 10:00:00",
      lastDate: "May 14 ,2026 10:00:00",
      duration: "01:00:00",
      resolution: "1080p",
      status: "In Progress",
      requestedOn: "May 14 ,2026 10:00:00"
    },
    {
      id: "ODR-2026-0005",
      camera: "Dispatch Area",
      startDate: "May 14 ,2026 10:00:00",
      lastDate: "May 14 ,2026 10:00:00",
      duration: "01:00:00",
      resolution: "1080p",
      status: "Completed",
      requestedOn: "May 14 ,2026 10:00:00"
    }
  ]);

  // Default activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "completed",
      text: "Stream completed: ODR-2024-0514-0001 (Camera-1)",
      meta: "Duration: 01:00:00 • 1080p",
      time: "2 mins ago"
    },
    {
      id: 2,
      type: "started",
      text: "Stream started: ODR-2024-0514-0003 (Camera-3)",
      meta: "Duration: 01:00:00 • 1080p",
      time: "15 mins ago"
    },
    {
      id: 3,
      type: "failed",
      text: "Stream failed: ODR-2024-0514-0004 (Camera-4)",
      meta: "Duration: 01:00:00 • 720p",
      time: "1 hour ago"
    }
  ]);

  // Filter States (just like CameraDashboard)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedCamera, setSelectedCamera] = useState("All Camera");
  const [selectedAction, setSelectedAction] = useState("Action");

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCameraDropdownOpen, setIsCameraDropdownOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedRequestIds, setSelectedRequestIds] = useState([]);
  const [deletingRequests, setDeletingRequests] = useState(null);

  const [toast, setToast] = useState({ message: null, type: "success" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
  };

  const handleCloseToast = () => {
    setToast({ message: null, type: "success" });
  };

  // Close dropdowns
  const closeAllDropdowns = () => {
    setIsStatusDropdownOpen(false);
    setIsCameraDropdownOpen(false);
    setIsActionDropdownOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All Status");
    setSelectedCamera("All Camera");
    setSelectedAction("Action");
    setCurrentPage(1);
    closeAllDropdowns();
    setShowCheckboxes(false);
    setSelectedRequestIds([]);
  };

  // Filter requests (real-time, no apply button needed)
  const filteredRequests = useMemo(() => {
    const list = [...requests];
    const q = searchQuery.trim().toLowerCase();

    return list.filter((req) => {
      const matchesSearch =
        !q ||
        req.id.toLowerCase().includes(q) ||
        req.camera.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "All Status" || req.status === selectedStatus;

      const matchesCamera =
        selectedCamera === "All Camera" || req.camera === selectedCamera;

      return matchesSearch && matchesStatus && matchesCamera;
    });
  }, [requests, searchQuery, selectedStatus, selectedCamera]);

  // Statistics
  const totalCount = requests.length + 995;
  const completedCount = requests.filter((r) => r.status === "Completed").length + 797;
  const failedCount = requests.filter((r) => r.status === "Failed").length + 199;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedRequests = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, activePage]);

  const showingStart = filteredRequests.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(activePage * itemsPerPage, filteredRequests.length);

  const paginationRange = useMemo(() => {
    const total = totalPages;
    const range = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) range.push(i);
    } else {
      if (activePage <= 3) {
        range.push(1, 2, 3, "...", total);
      } else if (activePage >= total - 2) {
        range.push(1, "...", total - 2, total - 1, total);
      } else {
        range.push(1, "...", activePage, "...", total);
      }
    }
    return range;
  }, [activePage, totalPages]);

  // Action options triggers (identical to CameraDashboard.jsx)
  const selectAction = (value) => {
    if (value === "Configure") {
      if (selectedRequestIds.length === 0) {
        showToast("Please select at least one request to configure", "danger");
      } else if (selectedRequestIds.length > 1) {
        showToast("Please select only one request to configure", "danger");
      } else {
        const selectedId = selectedRequestIds[0];
        showToast(`Configuration loaded for request ${selectedId}`, "info");
        setShowCheckboxes(false);
        setSelectedRequestIds([]);
      }
      setIsActionDropdownOpen(false);
      return;
    }

    if (value === "Delete") {
      if (selectedRequestIds.length === 0) {
        showToast("Please select at least one request to delete", "danger");
      } else {
        const selected = requests.filter((r) => selectedRequestIds.includes(r.id));
        setDeletingRequests(selected);
      }
      setIsActionDropdownOpen(false);
      return;
    }

    if (value === "Update") {
      if (selectedRequestIds.length === 0) {
        showToast("Please select at least one request to update", "danger");
      } else if (selectedRequestIds.length > 1) {
        showToast("Please select only one request to update", "danger");
      } else {
        const selectedId = selectedRequestIds[0];
        const editReq = requests.find((r) => r.id === selectedId);
        if (editReq) {
          setEditingRequest(editReq);
          setShowCheckboxes(false);
          setSelectedRequestIds([]);
          setIsSliderOpen(true);
        }
      }
      setIsActionDropdownOpen(false);
      return;
    }

    setSelectedAction(value);
    setIsActionDropdownOpen(false);
  };

  const confirmDeleteRequests = () => {
    if (deletingRequests) {
      const ids = deletingRequests.map((r) => r.id);
      setRequests((prev) => prev.filter((r) => !ids.includes(r.id)));
      setSelectedRequestIds([]);
      setDeletingRequests(null);
      setShowCheckboxes(false);
      showToast("Request(s) deleted successfully", "success");
    }
  };

  const handleCreateRequest = (formData) => {
    if (formData.draft) {
      showToast("Draft saved successfully", "info");
      setIsSliderOpen(false);
      setEditingRequest(null);
      return;
    }

    if (editingRequest) {
      // Update existing request
      setRequests((prev) =>
        prev.map((r) =>
          r.id === editingRequest.id
            ? {
                ...r,
                camera: formData.camera,
                startDate: formatDateTime(formData.startDateTime),
                lastDate: formatDateTime(formData.lastDateTime),
                duration: formData.duration || r.duration,
                resolution: formData.resolution || r.resolution
              }
            : r
        )
      );
      showToast("Stream request updated successfully", "success");
      setEditingRequest(null);
    } else {
      // Add new request
      const nextIndex = requests.length + 1;
      const id = `ODR-2026-000${nextIndex}`;
      const nowFormatted = formatDateTime(new Date());

      const newEntry = {
        id,
        camera: formData.camera,
        startDate: formatDateTime(formData.startDateTime),
        lastDate: formatDateTime(formData.lastDateTime),
        duration: formData.duration || "01:00:00",
        resolution: formData.resolution || "1080p",
        status: "In Progress",
        requestedOn: nowFormatted
      };

      setRequests([newEntry, ...requests]);

      // Add to activities
      const newActivity = {
        id: Date.now(),
        type: "started",
        text: `Stream started: ${id} (${formData.camera})`,
        meta: `Duration: ${formData.duration || "01:00:00"} • ${formData.resolution || "1080p"}`,
        time: "Just now"
      };
      setRecentActivities([newActivity, ...recentActivities]);
      showToast("Stream request created successfully", "success");
    }

    setIsSliderOpen(false);
  };

  return (
    <div className="camera-dashboard-host" onClick={closeAllDropdowns}>
      
      {/* Toast Alert floating */}
      {toast.message && (
        <div className="toast-floating-container">
          <div className={`toast-alert-card toast-${toast.type}`}>
            <div className="toast-icon-box">
              {toast.type === "success" ? "✓" : toast.type === "danger" ? "✗" : "ℹ"}
            </div>
            <span className="toast-message-text">{toast.message}</span>
            <button className="btn-toast-close" onClick={handleCloseToast}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRequests && deletingRequests.length > 0 && (
        <div
          className="modal-backdrop-overlay"
          onClick={() => setDeletingRequests(null)}
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

            <h3 className="delete-template-title">Delete Stream Request</h3>

            <div className="delete-template-description">
              <p>Are you sure you want to delete this Stream Request?</p>
              <p>This action cannot be undone!.</p>
            </div>

            <div className="delete-cameras-list" style={{ textAlign: "left", maxHeight: "100px", overflowY: "auto", marginBottom: "24px", padding: "10px", background: "#f8fafc", borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0", color: "#64748b" }}>
              <span style={{ fontWeight: "600", display: "block", marginBottom: "4px", color: "#475569" }}>Selected Request(s):</span>
              {deletingRequests.map(req => (
                <div key={req.id} style={{ padding: "2px 0" }}>
                  • <strong>{req.camera}</strong> ({req.id})
                </div>
              ))}
            </div>

            <div className="delete-template-btn-row">
              <button
                className="btn-delete-template-cancel"
                onClick={() => setDeletingRequests(null)}
              >
                Cancel
              </button>
              <button
                className="btn-delete-template-confirm"
                onClick={confirmDeleteRequests}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="camera-section-header">
        <button className="btn-add-camera" onClick={() => { setEditingRequest(null); setIsSliderOpen(true); }}>
          <span className="plus-icon">+</span>
          New Stream Request
        </button>
      </div>

      {/* Metrics Row (matching styles of CameraDashboard) */}
      <div className="metrics-cards-row">
        <div className="metric-card">
          <div className="metric-details">
            <span className="metric-label">Total Requests</span>
            <span className="metric-value">{totalCount}</span>
            <span className="metric-subtext font-green">↑ 12.5% from last 7 days</span>
          </div>
          <div className="card-chart-icon purple-card-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-details">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{completedCount}</span>
            <span className="metric-subtext font-green">↑ 12.5% from last 7 days</span>
          </div>
          <div className="card-chart-icon green-card-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-details">
            <span className="metric-label">Failed</span>
            <span className="metric-value">{failedCount}</span>
            <span className="metric-subtext font-red">↓ 0.7% from last 7 days</span>
          </div>
          <div className="card-chart-icon red-card-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Options (matching styling and dropdown behavior of CameraDashboard) */}
      <section className="filters-card-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="filters-row">
          
          {/* Search */}
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
              placeholder="Search by request id, camera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Camera Select */}
          <div className="filter-dropdown-container col-location-filter">
            <div className="custom-filter-dropdown" onClick={(e) => { e.stopPropagation(); const prev = isCameraDropdownOpen; closeAllDropdowns(); setIsCameraDropdownOpen(!prev); }}>
              <div className="dropdown-selected-box">
                <span>{selectedCamera}</span>
                <span className="chevron-arrow">▼</span>
              </div>
              {isCameraDropdownOpen && (
                <div className="dropdown-overlay-options">
                  {cameraOptions.map((item) => (
                    <div
                      key={item}
                      className="dropdown-option-item"
                      onClick={() => { setSelectedCamera(item); setIsCameraDropdownOpen(false); }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Select */}
          <div className="filter-dropdown-container">
            <div className="custom-filter-dropdown" onClick={(e) => { e.stopPropagation(); const prev = isStatusDropdownOpen; closeAllDropdowns(); setIsStatusDropdownOpen(!prev); }}>
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
                      onClick={() => { setSelectedStatus(item); setIsStatusDropdownOpen(false); }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Select */}
          <div className="filter-dropdown-container">
            <div className="custom-filter-dropdown">
              <div className="dropdown-selected-box">
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#64748b" }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Date Range
                </span>
                <span className="chevron-arrow">▼</span>
              </div>
            </div>
          </div>

          {/* Refresh/Reset filters button */}
          <button
            className="btn-refresh-box"
            onClick={resetFilters}
            aria-label="Refresh grid"
          >
            <svg
              className="refresh-icon"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>

          {/* Action trigger button */}
          <div className="filter-dropdown-container action-filter">
            <div className="custom-filter-dropdown" onClick={(e) => { e.stopPropagation(); const prev = isActionDropdownOpen; closeAllDropdowns(); setIsActionDropdownOpen(!prev); setShowCheckboxes(true); }}>
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
                        paginatedRequests.length > 0 &&
                        paginatedRequests.every((req) => selectedRequestIds.includes(req.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const pageIds = paginatedRequests.map((r) => r.id);
                          setSelectedRequestIds((prev) => Array.from(new Set([...prev, ...pageIds])));
                        } else {
                          const pageIds = paginatedRequests.map((r) => r.id);
                          setSelectedRequestIds((prev) => prev.filter((id) => !pageIds.includes(id)));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                )}
                <th className="col-id">Request ID</th>
                <th>Camera</th>
                <th>Start Date</th>
                <th>Last Date</th>
                <th>Duration</th>
                <th>Resolution</th>
                <th>Status</th>
                <th>Requested on</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRequests.map((req) => (
                <tr key={req.id}>
                  {showCheckboxes && (
                    <td className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRequestIds.includes(req.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRequestIds((prev) => [...prev, req.id]);
                          } else {
                            setSelectedRequestIds((prev) => prev.filter((id) => id !== req.id));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  <td className="col-id">
                    <button
                      className="camera-id-link"
                      style={{ background: "none", border: "none", padding: 0, font: "inherit", textAlign: "left", cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingRequest(req);
                        setIsSliderOpen(true);
                      }}
                    >
                      {req.id}
                    </button>
                  </td>
                  <td className="font-bold">{req.camera}</td>
                  <td className="text-grey">{req.startDate}</td>
                  <td className="text-grey">{req.lastDate}</td>
                  <td>{req.duration}</td>
                  <td>{req.resolution}</td>
                  <td>
                    <span className={`status-indicator-pill pill-${req.status.toLowerCase().replace(" ", "")}`}>
                      <span
                        className="status-indicator-dot"
                        style={{
                          backgroundColor:
                            req.status === "Completed"
                              ? "#2e7d32"
                              : req.status === "Failed"
                              ? "#c62828"
                              : "#0369a1"
                        }}
                      ></span>
                      {req.status}
                    </span>
                  </td>
                  <td className="text-grey">{req.requestedOn}</td>
                </tr>
              ))}

              {paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan={showCheckboxes ? 9 : 8} className="empty-state-cell">
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
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      <h4 className="empty-title">No Requests Found</h4>
                      <p className="empty-desc">
                        Try resetting your filters or adding a new stream request.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer controls */}
        <div className="table-footer-controls">
          <span className="table-info-text">
            Showing <strong>{showingStart}</strong> to <strong>{showingEnd}</strong> of{" "}
            <strong>{filteredRequests.length}</strong> entries
          </span>

          <nav className="pagination-navbar" aria-label="Table navigation">
            <button
              className="btn-pagination-arrow"
              disabled={activePage <= 1}
              onClick={() => activePage > 1 && setCurrentPage((prev) => prev - 1)}
            >
              ◀
            </button>

            {paginationRange.map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="pagination-ellipsis">...</span>
              ) : (
                <button
                  key={idx}
                  className={`btn-pagination-number ${activePage === p ? "active" : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="btn-pagination-arrow"
              disabled={activePage >= totalPages}
              onClick={() => activePage < totalPages && setCurrentPage((prev) => prev + 1)}
            >
              ▶
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom columns (Workflow & Activities) */}
      <div className="bottom-sections-grid">
        <div className="workflow-card">
          <div className="workflow-header">
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Stream Request Workflow</h3>
          </div>
          <div className="workflow-steps-container">
            <div className="workflow-step">
              <div className="workflow-step-icon purple">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="workflow-step-text">
                <span className="step-title">1. Request</span>
                <span className="step-desc">User requests stream</span>
              </div>
            </div>

            <div className="workflow-connector">
              <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12" />
                <polyline points="15 5 22 12 15 19" />
              </svg>
            </div>

            <div className="workflow-step">
              <div className="workflow-step-icon blue">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 11l2 2 4-4" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="workflow-step-text">
                <span className="step-title">2. Validate</span>
                <span className="step-desc">Validate access & check camera</span>
              </div>
            </div>

            <div className="workflow-connector">
              <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12" />
                <polyline points="15 5 22 12 15 19" />
              </svg>
            </div>

            <div className="workflow-step">
              <div className="workflow-step-icon orange">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.5c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                </svg>
              </div>
              <div className="workflow-step-text">
                <span className="step-title">3. Orchestrate</span>
                <span className="step-desc">Create KVS stream & manage session</span>
              </div>
            </div>

            <div className="workflow-connector">
              <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12" />
                <polyline points="15 5 22 12 15 19" />
              </svg>
            </div>

            <div className="workflow-step">
              <div className="workflow-step-icon green">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <rect x="2" y="3" width="20" height="4" rx="1" />
                  <circle cx="6" cy="5" r="1" fill="#ffffff" />
                  <circle cx="9" cy="5" r="1" fill="#ffffff" />
                  <rect x="2" y="10" width="20" height="4" rx="1" />
                  <circle cx="6" cy="12" r="1" fill="#ffffff" />
                  <circle cx="9" cy="12" r="1" fill="#ffffff" />
                  <rect x="2" y="17" width="20" height="4" rx="1" />
                  <circle cx="6" cy="19" r="1" fill="#ffffff" />
                  <circle cx="9" cy="19" r="1" fill="#ffffff" />
                </svg>
              </div>
              <div className="workflow-step-text">
                <span className="step-title">4. Transcode</span>
                <span className="step-desc">Transcode to multiple resolutions</span>
              </div>
            </div>

            <div className="workflow-connector">
              <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12" />
                <polyline points="15 5 22 12 15 19" />
              </svg>
            </div>

            <div className="workflow-step">
              <div className="workflow-step-icon light-blue">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                </svg>
              </div>
              <div className="workflow-step-text">
                <span className="step-title">5. Deliver</span>
                <span className="step-desc">Make available for playback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="activity-card">
          <div className="activity-card-header">
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>Recent Activity</h3>
            <button className="view-all-link">View All</button>
          </div>
          <div className="activity-list-container">
            {recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className={`activity-icon-wrapper ${act.type}`}>
                  {act.type === "completed" && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {act.type === "started" && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  )}
                  {act.type === "failed" && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>
                <div className="activity-content">
                  <span className="activity-title">{act.text}</span>
                  <span className="activity-meta">{act.meta}</span>
                </div>
                <div className="activity-time">{act.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewStreamSlider
        isOpen={isSliderOpen}
        onClose={() => { setIsSliderOpen(false); setEditingRequest(null); }}
        onSubmit={handleCreateRequest}
        editingRequest={editingRequest}
      />
    </div>
  );
}

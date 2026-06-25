import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddRole.css';

const VIDEO_SURVEILLANCE = [
  { name: 'Multi view', desc: 'Allow access to multiview' },
  { name: 'Live Stream', desc: 'Allow access to live stream' },
  { name: 'Alerts Event', desc: 'Allow access to alerts event' },
  { name: 'Camera List', desc: 'Allow access to cameralist' },
  { name: 'Playback View', desc: 'Allow access to playback view' }
];

const STREAMING_CONTROLS = [
  { name: 'Record', desc: 'Allow access to multiview' },
  { name: 'Mic', desc: 'Allow access to live stream' },
  { name: 'Audio', desc: 'Allow access to alerts event' },
  { name: 'Full Screen', desc: 'Allow access to camera list' },
  { name: 'Export Records', desc: 'Allow access to playback view' }
];

const AVAILABLE_CAMERAS = ['CAM-01', 'CAM-02', 'CAM-03'];

export default function AddRole({ onClose, onSave }) {
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [cameraScope, setCameraScope] = useState('All Camera');
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [cameraSearch, setCameraSearch] = useState('');

  // Error states
  const [errors, setErrors] = useState({});

  const togglePermission = (permissionName) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleCameraToggle = (cameraName) => {
    setSelectedCameras((prev) =>
      prev.includes(cameraName)
        ? prev.filter((c) => c !== cameraName)
        : [...prev, cameraName]
    );
  };

  const filteredCameras = AVAILABLE_CAMERAS.filter((camera) =>
    camera.toLowerCase().includes(cameraSearch.toLowerCase())
  );

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!roleName.trim()) {
      newErrors.roleName = 'Role Name is required';
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const newRole = {
      roleName,
      status: 'Active', // Default status under the hood
      description,
      permissions: selectedPermissions,
      cameraScope,
      selectedCameras: cameraScope === 'All Camera' ? [] : selectedCameras
    };

    if (onSave) onSave(newRole);
    if (onClose) onClose();
    else navigate('/user-access/roles');
  };

  return (
    <div className="role-form-page">
      <div className="ua-tabs">
        <button className="ua-tab" onClick={() => navigate('/user-access')}>
          User
        </button>
        <button className="ua-tab active">Role</button>
      </div>

     
<div className="form-title-row">

        <div className="header-row">

          {/* ✅ 👥 GROUP ICON */}
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="currentColor"
            className="header-role-icon"
          >
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3z"/>
            <path d="M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z"/>
            <path d="M8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13z"/>
            <path d="M16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h7v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>

          {/* ✅ TEXT */}
          <div className="header-text-group">
            <h3 className="form-main-title">Add Role</h3>
            <p className="form-subtitle">
              Add role details and configure permissions
            </p>
          </div>

        </div>



        <button
          className="form-close-btn"
          onClick={() => {
            if (onClose) onClose();
            else navigate('/user-access/roles');
          }}
        >
          ×
        </button>
      </div>

      <div className="role-form-scrollable">
      {/* Role Information Card */}
      <div className="form-card">
        <div className="form-card-header">Role Information</div>
        <div className="two-col-grid">
          <div className="form-group">
            <label>
              Role Name <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Admin"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
            {errors.roleName && (
              <span className="error-text">{errors.roleName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              placeholder=""
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Permissions Card */}
      <div className="form-card permission-card">
        <div className="form-card-header">
          Permission <span className="required-star">*</span>
          <div className="form-card-subtitle">Set Permissions for this role</div>
        </div>

        <div className="permissions-split-grid">
          {/* Left panel: Video Surveillance */}
          <div className="permission-panel">
            <h4 className="permission-panel-title">[ Video Surveillance ]</h4>
            <div className="permission-rows-list">
              {VIDEO_SURVEILLANCE.map((perm) => (
                <div key={perm.name} className="permission-row-item">
                  <div className="permission-text-col">
                    <span className="permission-label-name">{perm.name}</span>
                    <span className="permission-label-desc">{perm.desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.name)}
                      onChange={() => togglePermission(perm.name)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Streaming Controls */}
          <div className="permission-panel">
            <h4 className="permission-panel-title">[ Streaming Controls ]</h4>
            <div className="permission-rows-list">
              {STREAMING_CONTROLS.map((perm) => (
                <div key={perm.name} className="permission-row-item">
                  <div className="permission-text-col">
                    <span className="permission-label-name">{perm.name}</span>
                    <span className="permission-label-desc">{perm.desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.name)}
                      onChange={() => togglePermission(perm.name)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {errors.permissions && (
          <div className="error-text permission-error">
            {errors.permissions}
          </div>
        )}
      </div>

      {/* Camera Access Scope Card */}
      <div className="form-card camera-scope-card">
        <div className="form-card-header">
          Camera Access Scope
          <div className="form-card-subtitle">Choose camera for this role</div>
        </div>

        <div className="camera-scope-split-grid">
          {/* Left side: Radio buttons */}
          <div className="camera-scope-left-panel">
            <div className="scope-radio-list">
              <label className={`scope-radio-item ${cameraScope === 'All Camera' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="cameraScope"
                  checked={cameraScope === 'All Camera'}
                  onChange={() => setCameraScope('All Camera')}
                />
                <span className="custom-radio-dot"></span>
                <span className="scope-radio-label-text">All Camera</span>
              </label>

              <label className={`scope-radio-item ${cameraScope === 'Select Camera' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="cameraScope"
                  checked={cameraScope === 'Select Camera'}
                  onChange={() => setCameraScope('Select Camera')}
                />
                <span className="custom-radio-dot"></span>
                <span className="scope-radio-label-text">Select Camera</span>
              </label>
            </div>
          </div>

          {/* Right side: Cameras search & selection container */}
          <div className="camera-scope-right-panel">
            <div className="cameras-list-box-container">
              <div className="camera-search-wrapper">
                <svg
                  className="camera-search-icon"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search Cameras..."
                  value={cameraSearch}
                  onChange={(e) => setCameraSearch(e.target.value)}
                />
              </div>

              <div className="cameras-checkboxes-list">
                {filteredCameras.map((camera) => (
                  <label key={camera} className="camera-checkbox-item">
                    <input
                      type="checkbox"
                      checked={cameraScope === 'All Camera' || selectedCameras.includes(camera)}
                      disabled={cameraScope === 'All Camera'}
                      onChange={() => handleCameraToggle(camera)}
                    />
                    <span className="custom-checkbox-box"></span>
                    <span className="camera-checkbox-label">{camera}</span>
                  </label>
                ))}
                {filteredCameras.length === 0 && (
                  <div className="no-cameras-found">No cameras found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer Buttons */}
      <div className="form-footer-actions">
        <button
          className="form-cancel-btn"
          onClick={() => {
            if (onClose) onClose();
            else navigate('/user-access/roles');
          }}
        >
          Cancel
        </button>

        <button className="form-save-btn" onClick={handleSave}>
          Save Role
        </button>
      </div>
    </div>
  );
}
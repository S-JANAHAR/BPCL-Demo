import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditUser.css';

export default function EditUser({ user, onClose, onSave }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(() => {
    if (user) return { ...user };
    return {
      name: 'Shyam',
      email: 'shyam.10231@bpcl.com',
      role: 'User',
      status: 'Online'
    };
  });

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = () => {
    if (onSave) onSave(formData);
    if (onClose) onClose();
    else navigate('/user-access');
  };

  return (
    <div className="edit-user-page">

      {/* ✅ Tabs */}
      <div className="eu-tabs">
        <button className="eu-tab active">User</button>
        <button
          className="eu-tab"
          onClick={() => navigate('/user-access/roles')}
        >
          Role
        </button>
      </div>

      {/* ✅ ✅ HEADER WITH ICON */}
      <div className="eu-header">

        <div className="header-row">

          {/* ✅ FILLED USER ICON */}
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
            className="header-user-icon"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" />
            <path d="M12 14c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
          </svg>

          {/* ✅ TEXT GROUP */}
          <div className="header-text-group">
            <h3 className="eu-title">Edit User Details</h3>
            <p className="eu-subtitle">
              Edit user details and configure their roles
            </p>
          </div>

        </div>

        {/* ✅ CLOSE BUTTON */}
        <button
          className="eu-close-btn"
          onClick={() => {
            if (onClose) onClose();
            else navigate('/user-access');
          }}
        >
          ✕
        </button>

      </div>

      {/* ✅ FORM */}
      <div className="user-form-scrollable">
        <div className="eu-card">

          <div className="eu-card-header">User Information</div>

          <div className="eu-form-grid">

            {/* Name */}
            <div className="eu-form-group">
              <label>Name <span>*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="eu-form-group">
              <label>Email <span>*</span></label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            {/* Role */}
            <div className="eu-form-group">
              <label>Role <span>*</span></label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option>User</option>
                <option>Admin</option>
                <option>Quality Engineer</option>
                <option>Shift Supervisor</option>
                <option>Maintenance Engineer</option>
              </select>
            </div>

            {/* Status */}
            <div className="eu-form-group">
              <label>Status <span>*</span></label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* ✅ FOOTER */}
      <div className="eu-footer">
        <button
          className="eu-cancel-btn"
          onClick={() => {
            if (onClose) onClose();
            else navigate('/user-access');
          }}
        >
          Cancel
        </button>

        <button
          className="eu-save-btn"
          onClick={handleUpdate}
        >
          Update User
        </button>
      </div>

      {/* Hidden id */}
      <div style={{ display: 'none' }}>{id}</div>

    </div>
  );
}
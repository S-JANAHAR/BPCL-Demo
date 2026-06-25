import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddUser.css';

export default function AddUser({ onClose, onSave }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: ''
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (onSave) onSave(formData);
    if (onClose) onClose();
    else navigate('/user-access');
  };

  return (
    <div className="add-user-page">

      {/* Tabs */}
      <div className="au-tabs">
        <button className="au-tab active">User</button>
        <button
          className="au-tab"
          onClick={() => navigate('/user-access/roles')}
        >
          Role
        </button>
      </div>

      {/* ✅ ✅ UPDATED HEADER */}
      <div className="au-header">

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

          {/* ✅ TEXT BLOCK */}
          <div className="header-text-group">
            <h3 className="au-title">Add User</h3>
            <p className="au-subtitle">
              Add user details and configure their roles
            </p>
          </div>

        </div>

        {/* CLOSE BUTTON */}
        <button
          className="au-close-btn"
          onClick={() =>
            onClose ? onClose() : navigate('/user-access')
          }
        >
          ✕
        </button>

      </div>

      {/* Form */}
      <div className="user-form-scrollable">
        <div className="au-card">

          <div className="au-card-header">User Information</div>

          <div className="au-form-grid">

            {/* NAME */}
            <div className="au-form-group">
              <label>Name <span>*</span></label>
              <input
                type="text"
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div className="au-form-group">
              <label>Email <span>*</span></label>
              <input
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* ROLE */}
            <div className="au-form-group">
              <label>Role <span>*</span></label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option value="">Select Role</option>
                <option>User</option>
                <option>Admin</option>
                <option>Engineer</option>
                <option>Supervisor</option>
              </select>
              {errors.role && <p className="error-text">{errors.role}</p>}
            </div>

            {/* STATUS */}
            <div className="au-form-group">
              <label>Status <span>*</span></label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="">Select Status</option>
                <option>Online</option>
                <option>Offline</option>
              </select>
              {errors.status && <p className="error-text">{errors.status}</p>}
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="au-footer">
        <button
          className="au-cancel-btn"
          onClick={() =>
            onClose ? onClose() : navigate('/user-access')
          }
        >
          Cancel
        </button>

        <button className="au-save-btn" onClick={handleSave}>
          Save User
        </button>
      </div>

    </div>
  );
}
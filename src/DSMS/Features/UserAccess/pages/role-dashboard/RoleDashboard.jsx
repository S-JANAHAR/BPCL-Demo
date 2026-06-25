import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddRole from '../add-role/AddRole';
import EditRole from '../edit-role/EditRole';
import './RoleDashboard.css';

const INITIAL_ROLE_DATA = [
  {
    id: 1,
    roleName: 'Admin',
    permissionCount: '8 Permissions',
    createdDate: '05-06-2026 08:45',
    status: 'Active',
    description: 'Administrator role with full access',
    permissions: [
      'Multi view',
      'Live Stream',
      'Alerts Event',
      'Camera List',
      'Playback View',
      'Record',
      'Mic',
      'Audio'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 2,
    roleName: 'Shift Supervisor',
    permissionCount: '7 Permissions',
    createdDate: '07-06-2026 10:05',
    status: 'Active',
    description: 'Supervisor for daily plant shifts',
    permissions: [
      'Multi view',
      'Live Stream',
      'Alerts Event',
      'Camera List',
      'Playback View',
      'Record',
      'Mic'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 3,
    roleName: 'User',
    permissionCount: '2 Permissions',
    createdDate: '06-06-2026 09:15',
    status: 'Active',
    description: 'Standard viewer role',
    permissions: [
      'Live Stream',
      'Camera List'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 4,
    roleName: 'Logistics Coordinator',
    permissionCount: '4 Permissions',
    createdDate: '09-06-2026 12:10',
    status: 'Active',
    description: 'Coordinates dispatch and logistics cameras',
    permissions: [
      'Live Stream',
      'Alerts Event',
      'Camera List',
      'Playback View'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 5,
    roleName: 'Quality Control Engineer',
    permissionCount: '5 Permissions',
    createdDate: '10-06-2026 15:50',
    status: 'Active',
    description: 'Monitors quality check locations',
    permissions: [
      'Multi view',
      'Live Stream',
      'Camera List',
      'Playback View',
      'Record'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 6,
    roleName: 'Shift Supervisor',
    permissionCount: '7 Permissions',
    createdDate: '08-06-2026 11:20',
    status: 'Active',
    description: 'Supervisor for daily plant shifts',
    permissions: [
      'Multi view',
      'Live Stream',
      'Alerts Event',
      'Camera List',
      'Playback View',
      'Record',
      'Mic'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 7,
    roleName: 'Plant Operator',
    permissionCount: '3 Permissions',
    createdDate: '10-06-2026 13:35',
    status: 'Active',
    description: 'Operator with access to live feeds',
    permissions: [
      'Live Stream',
      'Camera List',
      'Record'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 8,
    roleName: 'Maintenance Engineer',
    permissionCount: '5 Permissions',
    createdDate: '11-06-2026 09:40',
    status: 'Active',
    description: 'Maintenance team lead',
    permissions: [
      'Multi view',
      'Live Stream',
      'Camera List',
      'Playback View',
      'Record'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 9,
    roleName: 'Shift Supervisor',
    permissionCount: '7 Permissions',
    createdDate: '12-06-2026 08:30',
    status: 'Active',
    description: 'Supervisor for daily plant shifts',
    permissions: [
      'Multi view',
      'Live Stream',
      'Alerts Event',
      'Camera List',
      'Playback View',
      'Record',
      'Mic'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 10,
    roleName: 'Maintenance Engineer',
    permissionCount: '5 Permissions',
    createdDate: '11-06-2026 14:25',
    status: 'Active',
    description: 'Maintenance team lead',
    permissions: [
      'Multi view',
      'Live Stream',
      'Camera List',
      'Playback View',
      'Record'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 11,
    roleName: 'Safety Officer',
    permissionCount: '6 Permissions',
    createdDate: '13-06-2026 10:25',
    status: 'Active',
    description: 'Monitors safety compliance and alerts',
    permissions: [
      'Multi view',
      'Live Stream',
      'Alerts Event',
      'Camera List',
      'Playback View',
      'Record'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  },
  {
    id: 12,
    roleName: 'Admin Viewer',
    permissionCount: '3 Permissions',
    createdDate: '14-06-2026 16:05',
    status: 'Active',
    description: 'Read-only administrator',
    permissions: [
      'Live Stream',
      'Camera List',
      'Playback View'
    ],
    cameraScope: 'All Camera',
    selectedCameras: []
  }
];

export default function RoleDashboard() {
  const navigate = useNavigate();
  const [activeDrawer, setActiveDrawer] = useState(null); // 'add' | 'edit' | null
  const [selectedRole, setSelectedRole] = useState(null);

  const [roles, setRoles] = useState(INITIAL_ROLE_DATA);

  const handleAddRoleLocal = (newRole) => {
    const nextId = Math.max(...roles.map(r => r.id), 0) + 1;
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-') + ' ' + new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setRoles(prev => [
      {
        id: nextId,
        roleName: newRole.roleName,
        permissionCount: `${newRole.permissions.length} Permissions`,
        createdDate: dateStr,
        ...newRole
      },
      ...prev
    ]);
    setToast({
      show: true,
      message: `Role "${newRole.roleName}" added successfully`
    });
  };

  const handleUpdateRoleLocal = (updatedRole) => {
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? {
      ...updatedRole,
      permissionCount: `${updatedRole.permissions.length} Permissions`
    } : r));
    setToast({
      show: true,
      message: `Role "${updatedRole.roleName}" updated successfully`
    });
  };

  const [roleNameFilter, setRoleNameFilter] = useState('');
  const [permissionFilter, setPermissionFilter] = useState('No. of Permission');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [permissionsTextFilter, setPermissionsTextFilter] = useState('');

  const [appliedRoleName, setAppliedRoleName] = useState('');
  const [appliedPermission, setAppliedPermission] = useState('No. of Permission');
  const [appliedRoleText, setAppliedRoleText] = useState('All Roles');
  const [appliedPermissionsText, setAppliedPermissionsText] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [toast, setToast] = useState({
    show: false,
    message: ''
  });

  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesRoleName =
        !appliedRoleName ||
        role.roleName.toLowerCase().includes(appliedRoleName.toLowerCase());

      const matchesPermission =
        appliedPermission === 'No. of Permission' ||
        role.permissionCount === appliedPermission;

      const matchesRoleText =
        appliedRoleText === 'All Roles' || role.roleName === appliedRoleText;

      const matchesPermissionsText =
        !appliedPermissionsText ||
        role.permissionCount.toLowerCase().includes(appliedPermissionsText.toLowerCase());

      return matchesRoleName && matchesPermission && matchesRoleText && matchesPermissionsText;
    });
  }, [roles, appliedRoleName, appliedPermission, appliedRoleText, appliedPermissionsText]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / itemsPerPage));

  const activePage = currentPage > totalPages ? 1 : currentPage;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedRoles = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredRoles.slice(start, start + itemsPerPage);
  }, [filteredRoles, activePage]);

  const showingStart =
    filteredRoles.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(activePage * itemsPerPage, filteredRoles.length);

  const paginationRange = useMemo(() => {
    const total = totalPages;
    const range = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i += 1) {
        range.push(i);
      }
    } else if (activePage <= 3) {
      range.push(1, 2, 3, '...', total);
    } else if (activePage >= total - 2) {
      range.push(1, '...', total - 2, total - 1, total);
    } else {
      range.push(1, '...', activePage, '...', total);
    }

    return range;
  }, [activePage, totalPages]);

  const handleApplyFilter = () => {
    setAppliedRoleName(roleNameFilter);
    setAppliedPermission(permissionFilter);
    setAppliedRoleText(roleFilter);
    setAppliedPermissionsText(permissionsTextFilter);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setRoleNameFilter('');
    setPermissionFilter('No. of Permission');
    setRoleFilter('All Roles');
    setPermissionsTextFilter('');
    setAppliedRoleName('');
    setAppliedPermission('No. of Permission');
    setAppliedRoleText('All Roles');
    setAppliedPermissionsText('');
    setCurrentPage(1);
  };

  const handleDeleteRole = (id, name) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
    setToast({
      show: true,
      message: `Role "${name}" deleted successfully`
    });
  };

  const prevPage = () => {
    if (activePage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (activePage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="rd-page">
      {toast.show && (
        <div className="entity-toast-card">
          <div className="entity-toast-left-border"></div>
          <div className="entity-toast-icon-area">
            <span className="entity-toast-check">✓</span>
          </div>
          <div className="entity-toast-message">{toast.message}</div>
          <button
            type="button"
            className="entity-toast-close"
            onClick={() => setToast({ show: false, message: '' })}
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      )}

      <div className="rd-tabs">
        <button className="rd-tab" onClick={() => navigate('/user-access')}>
          User
        </button>
        <button className="rd-tab active">Role</button>
      </div>

      <div className="rd-title-row">
        <div>
          <h3 className="rd-title">Manage Role</h3>
          <p className="rd-subtitle">Manage and monitor all registered Role Details.</p>
        </div>

        <button className="rd-primary-btn" onClick={() => setActiveDrawer('add')}>
          + Add Role
        </button>
      </div>

      <div className="rd-filter-row">
        <div className="rd-search-box">
          <svg
            className="rd-search-icon"
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
            placeholder="Role Name"
            value={roleNameFilter}
            onChange={(e) => setRoleNameFilter(e.target.value)}
          />
        </div>

        <select value={permissionFilter} onChange={(e) => setPermissionFilter(e.target.value)}>
          <option>No. of Permission</option>
          <option>10 Permissions</option>
          <option>7 Permissions</option>
          <option>6 Permissions</option>
          <option>5 Permissions</option>
          <option>4 Permissions</option>
          <option>3 Permissions</option>
          <option>2 Permissions</option>
        </select>

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option>All Roles</option>
          <option>Admin</option>
          <option>Shift Supervisor</option>
          <option>User</option>
          <option>Logistics Coordinator</option>
          <option>Quality Control Engineer</option>
          <option>Plant Operator</option>
          <option>Maintenance Engineer</option>
        </select>

        <input
          className="rd-permission-input"
          type="text"
          placeholder="Permissions"
          value={permissionsTextFilter}
          onChange={(e) => setPermissionsTextFilter(e.target.value)}
        />

        <button className="rd-apply-btn" onClick={handleApplyFilter}>
          Apply Filter
        </button>

        <button
          className="rd-refresh-btn"
          onClick={handleReset}
          aria-label="Refresh filters"
          title="Reset filters"
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
      </div>

      <div className="rd-table-card">
        <table className="rd-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>No. Of Permission</th>
              <th>Created Date</th>
              <th className="rd-action-col">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedRoles.map((role) => (
              <tr key={role.id}>
                <td>{role.roleName}</td>
                <td>{role.permissionCount}</td>
                <td>{role.createdDate}</td>
                <td className="rd-action-col">
                  <button
                    className="rd-icon-btn edit"
                    onClick={() => {
                      setSelectedRole(role);
                      setActiveDrawer('edit');
                    }}
                    title="Edit"
                  >
                    <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                  </button>
                  <button
                    className="rd-icon-btn delete"
                    title="Delete"
                    onClick={() => handleDeleteRole(role.id, role.roleName)}
                  >
                    <img src="/assets/icon_delete.png" alt="Delete" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                  </button>
                </td>
              </tr>
            ))}

            {paginatedRoles.length === 0 && (
              <tr>
                <td colSpan="4" className="rd-empty-cell">
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="user-table-footer-controls">
          <span className="table-info-text">
            Showing <strong>{showingStart}</strong> to{' '}
            <strong>{showingEnd}</strong> of{' '}
            <strong>{filteredRoles.length}</strong> entries
          </span>

          <nav className="pagination-navbar" aria-label="Table navigation">
            <button
              className="btn-pagination-arrow"
              disabled={activePage <= 1}
              onClick={prevPage}
            >
              ◀
            </button>

            {paginationRange.map((page, index) =>
              page === '...' ? (
                <span key={index} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  className={`btn-pagination-number ${
                    page === activePage ? 'active-page' : ''
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
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
            {activeDrawer === 'add' && <AddRole onClose={() => setActiveDrawer(null)} onSave={handleAddRoleLocal} />}
            {activeDrawer === 'edit' && <EditRole role={selectedRole} onClose={() => setActiveDrawer(null)} onSave={handleUpdateRoleLocal} />}
          </div>
        )}
      </div>
    </div>
  );
}
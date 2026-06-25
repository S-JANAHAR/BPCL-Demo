import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddUser from '../add-user/AddUser';
import EditUser from '../edit-user/EditUser';
import './UserDashboard.css';

const INITIAL_USER_DATA = [
  { id: 1, name: 'Shyam', email: 'shyam.10231@bpcl.com', role: 'User', status: 'Online' },
  { id: 2, name: 'Arjun Mehta', email: 'arjun.mehta.1230@bpcl.com', role: 'Plant Operator', status: 'Online' },
  { id: 3, name: 'Priya Sharma', email: 'priya.sharma.1230@bpcl.com', role: 'Quality Engineer', status: 'Online' },
  { id: 4, name: 'Rahul Nair', email: 'rahul.nair.1230@bpcl.com', role: 'Maintenance Engineer', status: 'Online' },
  { id: 5, name: 'Sneha Reddy', email: 'sneha.reddy.1230@bpcl.com', role: 'Safety Officer', status: 'Online' },
  { id: 6, name: 'Karan Malhotra', email: 'karan.malhotra.1230@bpcl.com', role: 'Shift Supervisor', status: 'Online' },
  { id: 7, name: 'Ananya Gupta', email: 'ananya.gupta.1230@bpcl.com', role: 'Maintenance Engineer', status: 'Online' },
  { id: 8, name: 'Vivek Rao', email: 'vivek.rao.1230@bpcl.com', role: 'User', status: 'Online' },
  { id: 9, name: 'Meera Iyer', email: 'meera.iyer.1230@bpcl.com', role: 'Safety Officer', status: 'Online' },
  { id: 10, name: 'Rohan Kapoor', email: 'rohan.kapoor.1230@bpcl.com', role: 'User', status: 'Online' },
  { id: 11, name: 'Akhil Raj', email: 'akhil.raj.1230@bpcl.com', role: 'Engineer', status: 'Offline' },
  { id: 12, name: 'Nisha Verma', email: 'nisha.verma.1230@bpcl.com', role: 'Admin', status: 'Online' }
];

const statusOptions = ['All Status', 'Online', 'Offline'];

const roleOptions = [
  'All Roles',
  'User',
  'Plant Operator',
  'Quality Engineer',
  'Maintenance Engineer',
  'Safety Officer',
  'Shift Supervisor',
  'Engineer',
  'Admin'
];

export default function UserDashboard() {
  const navigate = useNavigate();

  const [activeDrawer, setActiveDrawer] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState(INITIAL_USER_DATA);

  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [emailFilter, setEmailFilter] = useState('');

  const [appliedName, setAppliedName] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('All Status');
  const [appliedRole, setAppliedRole] = useState('All Roles');
  const [appliedEmail, setAppliedEmail] = useState('');

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

  const handleAddUserLocal = (newUser) => {
    const nextId = Math.max(...users.map((u) => u.id), 0) + 1;

    setUsers((prev) => [
      {
        id: nextId,
        ...newUser
      },
      ...prev
    ]);

    setToast({
      show: true,
      message: `User "${newUser.name}" added successfully`
    });
  };

  const handleUpdateUserLocal = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    setToast({
      show: true,
      message: `User "${updatedUser.name}" updated successfully`
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesName =
        !appliedName ||
        user.name.toLowerCase().includes(appliedName.toLowerCase());

      const matchesStatus =
        appliedStatus === 'All Status' || user.status === appliedStatus;

      const matchesRole =
        appliedRole === 'All Roles' || user.role === appliedRole;

      const matchesEmail =
        !appliedEmail ||
        user.email.toLowerCase().includes(appliedEmail.toLowerCase());

      return matchesName && matchesStatus && matchesRole && matchesEmail;
    });
  }, [users, appliedName, appliedStatus, appliedRole, appliedEmail]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  const activePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedUsers = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, activePage]);

  const showingStart =
    filteredUsers.length === 0 ? 0 : (activePage - 1) * itemsPerPage + 1;

  const showingEnd = Math.min(activePage * itemsPerPage, filteredUsers.length);

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
    setAppliedName(nameFilter);
    setAppliedStatus(statusFilter);
    setAppliedRole(roleFilter);
    setAppliedEmail(emailFilter);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setNameFilter('');
    setStatusFilter('All Status');
    setRoleFilter('All Roles');
    setEmailFilter('');

    setAppliedName('');
    setAppliedStatus('All Status');
    setAppliedRole('All Roles');
    setAppliedEmail('');

    setCurrentPage(1);
  };

  const handleDeleteUser = (id, name) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));

    setToast({
      show: true,
      message: `User "${name}" deleted successfully`
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
    <div className="user-dashboard-host">
      {toast.show && (
        <div className="toast-floating-container">
          <div className="toast-alert-card toast-success">
            <div className="toast-icon-box">✓</div>

            <span className="toast-message-text">
              {toast.message}
            </span>

            <button
              className="btn-toast-close"
              onClick={() => setToast({ show: false, message: '' })}
              aria-label="Close toast"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="user-tabs">
        <button className="user-tab active">
          User
        </button>

        <button
          className="user-tab"
          onClick={() => navigate('/user-access/roles')}
        >
          Role
        </button>
      </div>

      <div className="user-section-header">
        <div className="user-section-title-wrap">
          <h2 className="user-section-title">Manage User</h2>
          <p className="user-section-subtitle">
            Manage and monitor all registered User Details.
          </p>
        </div>

        <button
          className="btn-add-user"
          onClick={() => setActiveDrawer('add')}
        >
          <span className="plus-icon">+</span>
          Add User
        </button>
      </div>

      <section className="user-filters-card-wrapper">
        <div className="user-filters-row">
          <div className="user-search-input-container">
            <svg
              className="user-search-icon"
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
              className="user-search-bar"
              placeholder="Search User..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>

          <select
            className="user-filter-select status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <select
            className="user-filter-select role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roleOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <input
            className="user-email-input"
            type="text"
            placeholder="Search Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />

          <button className="btn-user-apply" onClick={handleApplyFilter}>
            Apply Filter
          </button>

          <button
            className="btn-user-refresh"
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
      </section>

      <div className="user-data-table-card">
        <div className="user-table-outer-wrapper">
          <table className="users-data-table">
            <thead>
              <tr>
                <th className="col-user-name">Name</th>
                <th className="col-user-email">Email</th>
                <th className="col-user-role">Role</th>
                <th className="col-user-status">Status</th>
                <th className="col-user-action">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="col-user-name font-bold">
                    {user.name}
                  </td>

                  <td className="col-user-email text-dark">
                    {user.email}
                  </td>

                  <td className="col-user-role text-dark">
                    {user.role}
                  </td>

                  <td className="col-user-status">
                    <span
                      className={`status-indicator-pill ${
                        user.status === 'Online'
                          ? 'pill-online'
                          : 'pill-offline'
                      }`}
                    >
                      <span className="status-indicator-dot"></span>
                      {user.status}
                    </span>
                  </td>

                  <td className="col-user-action">
                    <div className="user-action-btn-group">
                      <button
                        className="user-icon-btn edit"
                        title="Edit"
                        onClick={() => {
                          setSelectedUser(user);
                          setActiveDrawer('edit');
                        }}
                      >
                        <img src="/assets/icon_edit.png" alt="Edit" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                      </button>

                      <button
                        className="user-icon-btn delete"
                        title="Delete"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        <img src="/assets/icon_delete.png" alt="Delete" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state-cell">
                    <div className="empty-message-container">
                      <h4 className="empty-title">No User Found</h4>
                      <p className="empty-desc">
                        Try resetting your filters or adding a new user.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="user-table-footer-controls">
          <span className="table-info-text">
            Showing <strong>{showingStart}</strong> to{' '}
            <strong>{showingEnd}</strong> of{' '}
            <strong>{filteredUsers.length}</strong> entries
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

      <div
        className={`drawer-overlay ${activeDrawer ? 'active' : ''}`}
        onClick={() => setActiveDrawer(null)}
      ></div>

      <div className={`drawer-container ${activeDrawer ? 'active' : ''}`}>
        {activeDrawer && (
          <div className="drawer-content-scrollable">
            {activeDrawer === 'add' && (
              <AddUser
                onClose={() => setActiveDrawer(null)}
                onSave={handleAddUserLocal}
              />
            )}

            {activeDrawer === 'edit' && (
              <EditUser
                user={selectedUser}
                onClose={() => setActiveDrawer(null)}
                onSave={handleUpdateUserLocal}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
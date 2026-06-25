import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="5" rx="1" />
      <rect x="13" y="10" width="8" height="11" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ConfigIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function getPageMeta(pathname) {
  // ===== CAMERA MANAGEMENT =====
  if (pathname.startsWith('/camera-management/add')) {
    return {
      breadcrumb: ['Camera Management', 'Add Camera'],
      title: 'Camera Management',
      subtitle: 'Add camera details and location information'
    };
  }

  if (pathname.startsWith('/camera-management/details')) {
    return {
      breadcrumb: ['Camera Management', 'Camera Details'],
      title: 'Camera Management',
      subtitle: 'View camera details'
    };
  }

  if (pathname.startsWith('/camera-management/edit')) {
    return {
      breadcrumb: ['Camera Management', 'Edit Camera'],
      title: 'Camera Management',
      subtitle: 'Update camera details'
    };
  }

  if (pathname.startsWith('/camera-management')) {
    return {
      breadcrumb: ['Camera Management', 'Camera List'],
      title: 'Camera Management',
      subtitle: 'Manage and monitor all registered cameras.'
    };
  }

  // ===== CONFIGURATION HUB =====
  if (pathname.startsWith('/configuration-hub/recording')) {
    return {
      breadcrumb: ['Configuration hub', 'Recording'],
      title: 'Configuration Hub',
      subtitle: 'Add Configuration'
    };
  }

  if (pathname.startsWith('/configuration-hub/ai-rule')) {
    return {
      breadcrumb: ['Configuration hub', 'AI Rules'],
      title: 'Configuration Hub',
      subtitle: 'Add Configuration'
    };
  }

  if (pathname.startsWith('/configuration-hub/alerts')) {
    return {
      breadcrumb: ['Configuration hub', 'Alerts'],
      title: 'Configuration Hub',
      subtitle: 'Add Configuration'
    };
  }

  if (pathname.startsWith('/configuration-hub/streaming')) {
    return {
      breadcrumb: ['Configuration hub', 'Streaming'],
      title: 'Configuration Hub',
      subtitle: 'Add Configuration'
    };
  }

  if (pathname.startsWith('/configuration-hub')) {
    return {
      breadcrumb: ['Configuration Hub'],
      title: 'Configuration Hub',
      subtitle: 'Manage system configuration'
    };
  }

  // ===== USER & ACCESS =====
  if (pathname.startsWith('/user-access/add-role')) {
    return {
      breadcrumb: ['User and Access', 'Role'],
      title: 'User and Access',
      subtitle: 'Add Role'
    };
  }

  if (pathname.startsWith('/user-access/edit-role')) {
    return {
      breadcrumb: ['User and Access', 'Role'],
      title: 'User and Access',
      subtitle: 'Edit Role'
    };
  }

  if (pathname.startsWith('/user-access/add')) {
    return {
      breadcrumb: ['User and Access', 'User'],
      title: 'User and Access',
      subtitle: 'Add User'
    };
  }

  if (pathname.startsWith('/user-access/edit')) {
    return {
      breadcrumb: ['User and Access', 'User'],
      title: 'User and Access',
      subtitle: 'Edit User'
    };
  }

  if (pathname.startsWith('/user-access/roles')) {
    return {
      breadcrumb: ['User and Access', 'Role'],
      title: 'User and Access',
      subtitle: 'Manage User and Role'
    };
  }

  if (pathname.startsWith('/user-access')) {
    return {
      breadcrumb: ['User and Access', 'User'],
      title: 'User and Access',
      subtitle: 'Manage User and Role'
    };
  }

  // ===== DASHBOARD =====
  return {
    breadcrumb: ['Dashboard'],
    title: 'Dashboard',
    subtitle: 'Overview and monitoring'
  };
}

export default function NavBar({ userName = 'ayush', userRole = 'admin' }) {
  const collapsed = false;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pageMeta = useMemo(() => getPageMeta(location.pathname), [location.pathname]);

  const menuItems = [
    {
      label: 'Dashboard',
      to: '/dashboard/on-demand',
      icon: <DashboardIcon />,
      match: (pathname) => pathname.startsWith('/dashboard') || pathname === '/'
    },
    {
      label: 'Camera Management',
      to: '/camera-management',
      icon: <CameraIcon />,
      match: (pathname) => pathname.startsWith('/camera-management')
    },
    {
      label: 'User and Access',
      to: '/user-access',
      icon: <UserIcon />,
      match: (pathname) => pathname.startsWith('/user-access')
    }
  ];

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className={`app-layout-shell ${sidebarHidden ? 'sidebar-hidden' : collapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <button
        className="app-sidebar-floating-btn"
        onClick={() => {
          if (window.innerWidth <= 992) {
            setMobileSidebarOpen(true);
          } else {
            setSidebarHidden(false);
          }
        }}
        aria-label="Open sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="app-sidebar-topbar">
          <div className="app-brand-block" onClick={() => navigate('/dashboard')}>
            <div className="app-logo-row">
              <div className="app-logo-box bpcl">
                <img
                  src="/assets/logo_bpcl.png"
                  alt="BPCL Logo"
                  className="app-logo-image bpcl-logo-image"
                />
              </div>

              <div className="app-logo-box eil">
                <img
                  src="/assets/logo_eil.png"
                  alt="EIL Logo"
                  className="app-logo-image"
                />
              </div>
            </div>

            {!collapsed && (
              <div className="app-logo-text">
                <span className="digi">Digi</span>
                <span className="bprep">BPREP</span>
              </div>
            )}
          </div>

          <button
            className="app-sidebar-toggle-btn"
            onClick={() => {
              if (window.innerWidth <= 992) {
                setMobileSidebarOpen(false);
              } else {
                setSidebarHidden(true);
              }
            }}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className="app-sidebar-menu">
          {menuItems.map((item) => {
            const isActive = item.match(location.pathname);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`app-sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <div className="app-sidebar-icon-wrapper">{item.icon}</div>
                {!collapsed && <span className="app-sidebar-text">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Top Header */}
      <header className="app-top-header">
        <div className="app-header-left">
          <div className="app-page-breadcrumb">
            {pageMeta.breadcrumb.map((item, index) => (
              <React.Fragment key={item}>
                <span className={index === pageMeta.breadcrumb.length - 1 ? 'current' : ''}>
                  {item}
                </span>
                {index < pageMeta.breadcrumb.length - 1 && (
                  <span className="app-breadcrumb-separator">&gt;</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <h1 className="app-page-title">{pageMeta.title}</h1>
          <p className="app-page-subtitle">{pageMeta.subtitle}</p>
        </div>

        <div className="app-header-user-area">
          <div className="app-user-avatar-circle">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div className="app-user-profile">
            <div className="app-user-name">{userName}</div>
            <div className="app-user-role">{userRole}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-content-area" onClick={closeMobileSidebar}>
        <Outlet />
      </main>

      {mobileSidebarOpen && (
        <div className="app-sidebar-overlay" onClick={closeMobileSidebar}></div>
      )}
    </div>
  );
}
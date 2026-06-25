import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./VMSLayout.css";

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="5" rx="1" />
      <rect x="13" y="10" width="8" height="11" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function getVMSPageMeta(pathname) {
  if (pathname.includes("/recordings")) {
    return {
      breadcrumb: ["Dashboard", "plack back"],
      title: "Play back",
      subtitle: "Play back video",
    };
  }
  return {
    breadcrumb: ["Dashboard", "Home"],
    title: "Home",
    subtitle: "Live Stream camera videos",
  };
}

export default function VMSLayout({ userName = "ayush", userRole = "admin" }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pageMeta = useMemo(
    () => getVMSPageMeta(location.pathname),
    [location.pathname]
  );

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const handleNoNavigationClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMobileSidebarOpen(false);
  };

  return (
    <div
      className={`app-layout-shell vms-theme ${
        sidebarHidden ? "sidebar-hidden" : ""
      } ${mobileSidebarOpen ? "mobile-sidebar-open" : ""}`}
    >
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

      {/* VMS Sidebar */}
      <aside
        className={`app-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="app-sidebar-topbar">
          <div
            className="app-brand-block"
            onClick={() => navigate("/dashboard")}
          >
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

            <div className="app-logo-text">
              <span className="digi">Digi</span>
              <span className="bprep">BPREP</span>
            </div>
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

        {/* Video Surveillance Navigation Section */}
        <div className="sidebar-section-title">Video Surveillance</div>

        <nav className="app-sidebar-menu">
          {/* Home - Navigation allowed */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `app-sidebar-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileSidebarOpen(false)}
            end
          >
            <div className="app-sidebar-icon-wrapper">
              <HomeIcon />
            </div>
            <span className="app-sidebar-text">Home</span>
          </NavLink>

          {/* Alerts Event - No Navigation */}
          <button
            type="button"
            className="app-sidebar-item app-sidebar-button"
            onClick={handleNoNavigationClick}
          >
            <div className="app-sidebar-icon-wrapper">
              <BellIcon />
            </div>
            <span className="app-sidebar-text">Alerts Event</span>
          </button>

          {/* Recordings - Navigation to /dashboard/recordings */}
          <NavLink
            to="/dashboard/recordings"
            className={({ isActive }) =>
              `app-sidebar-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="app-sidebar-icon-wrapper">
              <VideoIcon />
            </div>
            <span className="app-sidebar-text">Recordings</span>
          </NavLink>
        </nav>

        {/* Admin Navigation Section */}
        <div className="sidebar-admin-footer">
          <div className="sidebar-section-title">Admin</div>

          <nav className="app-sidebar-menu">
            <NavLink
              to="/camera-management"
              className="app-sidebar-item admin-dashboard-btn"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <div className="app-sidebar-icon-wrapper">
                <DashboardIcon />
              </div>
              <span className="app-sidebar-text">Dashboard</span>
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Top Header */}
      <header className="app-top-header">
        <div className="app-header-left">
          <div className="app-page-breadcrumb">
            {pageMeta.breadcrumb.map((item, index) => (
              <React.Fragment key={item}>
                <span
                  className={
                    index === pageMeta.breadcrumb.length - 1 ? "current" : ""
                  }
                >
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

      {/* Content Area */}
      <main className="app-content-area" onClick={closeMobileSidebar}>
        <Outlet />
      </main>

      {mobileSidebarOpen && (
        <div
          className="app-sidebar-overlay"
          onClick={closeMobileSidebar}
        ></div>
      )}
    </div>
  );
}
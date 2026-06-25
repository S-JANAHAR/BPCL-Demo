import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';


import NavBar from './DSMS/Shared/Navbar/NavBar';


import CameraDashboard from './DSMS/Features/Camera/pages/camera-dashboard/CameraDashboard';
import AddCamera from './DSMS/Features/Camera/pages/add-camera/AddCamera';
import CameraDetails from './DSMS/Features/Camera/pages/camera-details/CameraDetails';
import UserDashboard from './DSMS/Features/UserAccess/pages/user-dashboard/UserDashboard';
import RoleDashboard from './DSMS/Features/UserAccess/pages/role-dashboard/RoleDashboard';
import AddUser from './DSMS/Features/UserAccess/pages/add-user/AddUser';
import EditUser from './DSMS/Features/UserAccess/pages/edit-user/EditUser';
import AddRole from './DSMS/Features/UserAccess/pages/add-role/AddRole';
import EditRole from './DSMS/Features/UserAccess/pages/edit-role/EditRole';
import ConfigurationHub from './DSMS/Shared/ConfigureHub/ConfigurationHub';

import VMSLayout from './VMS/Layout/VMSLayout';
import VMSDashboard from './VMS/Features/Dashboard/pages/Dashboard';
import Recordings from './VMS/Features/Recording/pages/Recordings';

import './App.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>


        <Route path="/" element={<NavBar />}>


          <Route index element={<Navigate to="/camera-management" replace />} />


          {/* =========================
              CAMERA MANAGEMENT
          ========================= */}
          <Route path="camera-management" element={<CameraDashboard />} />
          <Route path="camera-management/add" element={<AddCamera />} />
          <Route path="camera-management/edit/:id" element={<CameraDetails />} />
          <Route path="camera-management/details/:id" element={<CameraDetails />} />

          {/* =========================
              CONFIGURATION HUB
          ========================= */}
          <Route path="configuration-hub" element={<Navigate to="/configuration-hub/recording" replace />} />
          <Route path="configuration-hub/:tab" element={<ConfigurationHub />} />

          {/* =========================
              USER AND ACCESS MANAGEMENT
          ========================= */}
          <Route path="user-access" element={<UserDashboard />} />
          <Route path="user-access/add" element={<AddUser />} />
          <Route path="user-access/edit/:id" element={<EditUser />} />
          <Route path="user-access/roles" element={<RoleDashboard />} />
          <Route path="user-access/add-role" element={<AddRole />} />
          <Route path="user-access/edit-role/:id" element={<EditRole />} />

          <Route path="*" element={<Navigate to="/camera-management" replace />} />

        </Route>

        {/* =========================
            VIDEO SURVEILLANCE MODULE (VMS)
        ========================= */}
        <Route path="/dashboard" element={<VMSLayout />}>
          <Route index element={<VMSDashboard />} />
          <Route path="recordings" element={<Recordings />} />
        </Route>

      </Routes>
    </HashRouter>
  );
}
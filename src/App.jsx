import React, { useState } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './screens/LandingPage';
import OrgSelectionScreen from './screens/OrgSelectionScreen';
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import DoctorDashboard from './screens/DoctorDashboard';
import LabTechDashboard from './screens/LabTechDashboard';

export default function App() {
  // Navigation & State Management
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedOrg, setSelectedOrg] = useState({
    id: 'org-apex',
    name: 'Apex Eye Care & Retina Foundation',
    type: 'Tertiary Eye Hospital',
    location: 'Metropolitan Campus'
  });
  const [userRole, setUserRole] = useState('doctor'); // 'admin' | 'doctor' | 'lab_tech'
  const [userEmail, setUserEmail] = useState('');
  // Workflow Handlers
  const handleLandingLoginClick = () => {
    setCurrentScreen('org_select');
  };

  const handleOrgSelected = (org) => {
    setSelectedOrg(org);
    setCurrentScreen('login');
  };

  const handleLoginSuccess = ({ role, email, org }) => {
    setUserRole(role);
    setUserEmail(email);
    if (org) setSelectedOrg(org);

    // Route to corresponding role dashboard
    if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
    } else if (role === 'doctor') {
      setCurrentScreen('doctor_dashboard');
    } else if (role === 'lab_tech') {
      setCurrentScreen('lab_tech_dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Global Header */}
      <Navigation
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        userRole={userRole}
        selectedOrg={selectedOrg}
      />

      {/* Screen Render Switch */}
      <div className="flex-1">
        {currentScreen === 'landing' && (
          <LandingPage onLoginClick={handleLandingLoginClick} />
        )}

        {currentScreen === 'org_select' && (
          <OrgSelectionScreen
            onSelectOrg={handleOrgSelected}
            onBackToLanding={() => setCurrentScreen('landing')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            selectedOrg={selectedOrg}
            onLoginSuccess={handleLoginSuccess}
            onChangeOrg={() => setCurrentScreen('org_select')}
          />
        )}

        {currentScreen === 'admin_dashboard' && (
          <AdminDashboard
            selectedOrg={selectedOrg}
          />
        )}

        {currentScreen === 'doctor_dashboard' && (
          <DoctorDashboard
            selectedOrg={selectedOrg}
          />
        )}

        {currentScreen === 'lab_tech_dashboard' && (
          <LabTechDashboard
            selectedOrg={selectedOrg}
          />
        )}
      </div>
    </div>
  );
}

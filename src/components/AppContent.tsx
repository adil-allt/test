import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import Appointments from '../pages/Appointments';
import Agenda2 from '../pages/Agenda2';
import Patients from '../pages/Patients';
import Treatments from '../pages/Treatments';
import Billing from '../pages/Billing';
import CabinetManagement from '../pages/CabinetManagement';
import AdminPanel from '../pages/AdminPanel';
import Backup from '../pages/Backup';
import Absences from '../pages/Absences';
import Notifications from '../pages/Notifications';
import Statistics from '../pages/Statistics';

export default function AppContent() {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 mt-16">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute requiredPermissions={['view_dashboard']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/appointments" element={
                <ProtectedRoute requiredPermissions={['view_appointments']}>
                  <Appointments />
                </ProtectedRoute>
              } />
              <Route path="/agenda2" element={
                <ProtectedRoute requiredPermissions={['view_appointments']}>
                  <Agenda2 />
                </ProtectedRoute>
              } />
              <Route path="/patients" element={
                <ProtectedRoute requiredPermissions={['view_patients']}>
                  <Patients />
                </ProtectedRoute>
              } />
              <Route path="/treatments" element={
                <ProtectedRoute requiredPermissions={['view_treatments']}>
                  <Treatments />
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute requiredPermissions={['view_billing']}>
                  <Billing />
                </ProtectedRoute>
              } />
              <Route path="/cabinet" element={
                <ProtectedRoute requiredPermissions={['view_supplies']}>
                  <CabinetManagement />
                </ProtectedRoute>
              } />
              <Route path="/statistics" element={
                <ProtectedRoute requiredPermissions={['view_supplies']}>
                  <Statistics />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredPermissions={['manage_users']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/backup" element={
                <ProtectedRoute requiredPermissions={['manage_users']}>
                  <Backup />
                </ProtectedRoute>
              } />
              <Route path="/absences" element={
                <ProtectedRoute requiredPermissions={['view_supplies']}>
                  <Absences />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute requiredPermissions={['manage_users']}>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                hasPermission('view_dashboard') ? 
                  <Navigate to="/" /> : 
                  <Navigate to="/appointments" />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
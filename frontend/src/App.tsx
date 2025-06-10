import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeListPage from './pages/EmployeeListPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import MainLayout from './layouts/MainLayout';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recover-password" element={<RecoverPasswordPage />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />

          <Route path="/employees" element={
            <PrivateRoute>
              <EmployeeListPage />
            </PrivateRoute>
          } />

          <Route path="/employees/add" element={
            <PrivateRoute>
              <EmployeesPage />
            </PrivateRoute>
          } />

          <Route path="/employees/edit/:id" element={
            <PrivateRoute>
              <EmployeesPage />
            </PrivateRoute>
          } />

          <Route path="/change-password" element={
            <PrivateRoute>
              <ChangePasswordPage />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
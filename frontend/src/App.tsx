import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import Header from './components/Header';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>    
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Header />
            <div style={{ paddingTop: '80px', flexGrow: 1 }}> 
              <DashboardPage />
            </div>
          </PrivateRoute>
        } />
        <Route path="/employees" element={
          <PrivateRoute>
            <Header />
            <div style={{ paddingTop: '80px', flexGrow: 1 }}>
              <EmployeesPage />
            </div>
          </PrivateRoute>
        } />
        <Route path="/change-password" element={
          <PrivateRoute>
            <Header />
            <div style={{ paddingTop: '80px', flexGrow: 1 }}>
              <ChangePasswordPage />
            </div>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

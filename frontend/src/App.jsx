import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/authStore';

import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { Dashboard } from './pages/Dashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPanel from './pages/AdminPanel';
import HorsePage from './pages/HorsePage';
import HorseDetails from './pages/HorseDetails';
import HorsesForTasks from './pages/HorsesForTasks';



// Protected route logic
const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // if (!user?.isVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  return children;
};

// Redirect if already authenticated
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Log the user object when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ Authenticated user:', user);
    }
  }, [isAuthenticated, user]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Checking authentication...
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoutes>
                <AdminPanel />
              </ProtectedRoutes>
            }
          />
          <Route
        path="/horses/stable/:stableId"
        element={
          <ProtectedRoutes>
            <HorsePage />
          </ProtectedRoutes>
          }
        />
          <Route
            path="/horses/:horseId"
            element={
              <ProtectedRoutes>
                <HorseDetails />
              </ProtectedRoutes>
            }
          />
        </Routes>
        
      </Router>

      


      <Toaster />
    </div>
  );
}

export default App;

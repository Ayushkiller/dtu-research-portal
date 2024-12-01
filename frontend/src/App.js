import React, { useState, useEffect, useCallback, createContext, useContext, Suspense } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';
import LandingPage from './components/LandingPage';

// Authentication Context for global state management
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const login = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      setUser(decoded);
    } catch (error) {
      console.error('Invalid token', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login(token);
    }
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Dynamically imported components
const componentMap = {
  student: React.lazy(() => import('./components/StudentDashboard')),
  faculty: React.lazy(() => import('./components/FacultyDashboard')),
  committee: React.lazy(() => import('./components/CommitteeDashboard')),
  dean: React.lazy(() => import('./components/DeanDashboard'))
};

function App() {
  const { user, logout } = useAuth();
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(true);

  const handleLandingFinish = () => {
    setIsLandingVisible(false);
  };

  const renderDashboard = () => {
    if (!user) return null;

    const Dashboard = componentMap[user.role];
    return (
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <Dashboard />
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {isLandingVisible ? (
        <LandingPage onFinish={handleLandingFinish} />
      ) : (
        <>
          <header className="mb-6 text-center w-full">
            <h1 className="text-3xl font-bold text-blue-700">DTU Research Portal</h1>
          </header>

          {!user ? (
            <div className="container w-full max-w-sm mx-auto">
            {isSigningIn ? (
              <div className="sign-in-container bg-white p-6 rounded-lg shadow-md">
                <Login />
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
                  <button
                    onClick={() => setIsSigningIn(false)}
                    className="text-blue-600 hover:underline text-lg font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            ) : (
              <div className="sign-up-container bg-white p-6 rounded-lg shadow-md">
                <RegisterUser />
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
                  <button
                    onClick={() => setIsSigningIn(true)}
                    className="text-blue-600 hover:underline text-lg font-medium"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
          
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-medium text-gray-800">
                  Welcome, {user.name} ({user.role})
                </p>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
              {renderDashboard()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

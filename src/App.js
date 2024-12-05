import React, { useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import LandingPage from './components/LandingPage';
import StudentDashboard from './studentdashboard/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import CommitteeDashboard from './components/CommitteeDashboard';
import DeanDashboard from './components/DeanDashboard';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [user, setUser] = useState(null);

  const handleLandingFinish = () => {
    setIsLandingVisible(false);
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
          {isLandingVisible ? (
            <LandingPage onFinish={handleLandingFinish} />
          ) : (
            <>
              <div className="container w-full max-w-sm mx-auto">
                <div className="sign-in-container bg-white p-6 rounded-lg shadow-md">
                  <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                    <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
                    <Route path="/dean-dashboard" element={<DeanDashboard />} />
                  </Routes>
                </div>
              </div>
            </>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
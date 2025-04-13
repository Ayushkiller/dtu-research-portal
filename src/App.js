import React, { useState, useContext, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
import LandingPage from "./components/LandingPage";
import Dashboard from "./dashboard/Dashboard";
import DeanDashboard from "./dashboard/DeanDashboard";
import CommitteeDashboard from "./dashboard/CommitteeDashboard";
import Cookies from "js-cookie";
import ConfirmAuthorship from "./ConfirmAuthorship";
import CommitteeApprovals from "./dashboard/components/CommitteeApprovals";
import CommitteeRejected from "./dashboard/components/CommitteeRejected";
import CommitteePending from "./dashboard/components/CommitteePending";

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
    Cookies.remove("token");
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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dean-dashboard" element={<DeanDashboard />} />
                    <Route
                      path="/committee-dashboard"
                      element={<CommitteeDashboard />}
                    />
                    <Route
                      path="/confirm-authorship"
                      element={<ConfirmAuthorship />}
                    />
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

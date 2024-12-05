import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/signin/SignIn';
import SignUp from './components/signup/SignUp';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import CommitteeDashboard from './components/CommitteeDashboard';
import DeanDashboard from './components/DeanDashboard';
function App() {
  const [isLandingVisible, setIsLandingVisible] = useState(true);

  const handleLandingFinish = () => {
    setIsLandingVisible(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        {isLandingVisible ? (
          <LandingPage onFinish={handleLandingFinish} />
        ) : (
          <>
            <header className="mb-6 text-center w-full">
              <h1 className="text-3xl font-bold text-blue-700">DTU Research Portal</h1>
            </header>
            <div className="container w-full max-w-sm mx-auto">
              <div className="sign-in-container bg-white p-6 rounded-lg shadow-md">
                <Routes>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/landing" element={<LandingPage />} />
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
  );
}

export default App;
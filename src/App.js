import React, { useState } from 'react';
import SignIn from './components/signin/SignIn';
import LandingPage from './components/LandingPage';

function App() {
  const [isLandingVisible, setIsLandingVisible] = useState(true);

  const handleLandingFinish = () => {
    setIsLandingVisible(false);
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
          <div className="container w-full max-w-sm mx-auto">
            <div className="sign-in-container bg-white p-6 rounded-lg shadow-md">
              <SignIn />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
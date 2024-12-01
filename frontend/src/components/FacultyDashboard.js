import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const [papers, setPapers] = useState([]);
  
  // Simulate fetching faculty papers from an API or database
  useEffect(() => {
    if (user) {
      // Mock data (replace with actual API call)
      setPapers([
        { title: 'Research Paper 1', journal: 'Journal of AI', year: 2023 },
        { title: 'Research Paper 2', journal: 'Journal of Robotics', year: 2022 },
      ]);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Faculty Dashboard</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Welcome, {user.name}</h3>
        
        <p className="text-lg text-gray-600 mb-4">Your Research Papers:</p>

        {papers.length > 0 ? (
          <div className="space-y-4">
            {papers.map((paper, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-medium text-gray-800">{paper.title}</h4>
                <p className="text-sm text-gray-600">Published in: {paper.journal}</p>
                <p className="text-sm text-gray-600">Year: {paper.year}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no papers listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;

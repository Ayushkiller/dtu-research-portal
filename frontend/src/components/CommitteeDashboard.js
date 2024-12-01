import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function CommitteeDashboard() {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      const token = localStorage.getItem('token');
      const response = await API.get('/research', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPapers(response.data);
    };

    fetchPapers();
  }, []);

  return (
    <div>
      <h2>Committee Dashboard</h2>
      {papers.length > 0 ? (
        <ul>
          {papers.map((paper) => (
            <li key={paper._id}>
              {paper.title} - {paper.submittedBy}
              {/* Approve button here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No papers to review.</p>
      )}
    </div>
  );
}

export default CommitteeDashboard;

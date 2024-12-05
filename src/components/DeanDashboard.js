import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function DeanDashboard() {
  const [researchPapers, setResearchPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/dean/research-papers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResearchPapers(response.data);
      } catch (error) {
        setErrorMessage('Error fetching papers.');
      }
    };

    fetchPapers();
  }, []);

  const handleReview = async (paperId) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(
        `/dean/review-paper/${paperId}`,
        { status, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Paper reviewed successfully.');
      setErrorMessage('');
      setSelectedPaper(null);
      setStatus('');
      setRemarks('');
      // Reload papers after review
      const fetchPapers = async () => {
        try {
          const response = await API.get('/dean/research-papers', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setResearchPapers(response.data);
        } catch (error) {
          setErrorMessage('Error fetching papers.');
        }
      };
      fetchPapers();
    } catch (error) {
      setErrorMessage('Error reviewing paper.');
    }
  };

  return (
    <div>
      <h2>Dean Dashboard</h2>
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      <h3>Research Papers Pending Review</h3>
      <ul>
        {researchPapers.map((paper) => (
          <li key={paper._id}>
            <p>{paper.title} by {paper.submittedBy.name}</p>
            <button onClick={() => setSelectedPaper(paper)}>Review</button>
          </li>
        ))}
      </ul>

      {selectedPaper && (
        <div>
          <h4>Review Paper: {selectedPaper.title}</h4>
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label>Remarks:</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} required />
          </div>
          <button onClick={() => handleReview(selectedPaper._id)}>Submit Review</button>
        </div>
      )}
    </div>
  );
}

export default DeanDashboard;

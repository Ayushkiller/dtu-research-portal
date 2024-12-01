import React, { useState } from 'react';
import API from '../api/axios';

function StudentDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    journalName: '',
    impactFactor: '',
    indexing: '',
    volNo: '',
    pageNo: '',
    year: '',
    publisher: '',
    isPaid: false,
    paperLink: '',
    doi: '',
    externalAuthors: '',
    internalAuthors: '',
    awardShareValue: '',
    totalAwardAmount: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/research/submit', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setFormData({ // Clear form after submission
        title: '',
        journalName: '',
        impactFactor: '',
        indexing: '',
        volNo: '',
        pageNo: '',
        year: '',
        publisher: '',
        isPaid: false,
        paperLink: '',
        doi: '',
        externalAuthors: '',
        internalAuthors: '',
        awardShareValue: '',
        totalAwardAmount: '',
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Something went wrong.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Journal Name</label>
          <input 
            type="text" 
            name="journalName" 
            value={formData.journalName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Impact Factor</label>
          <input 
            type="number" 
            step="0.01" 
            name="impactFactor" 
            value={formData.impactFactor} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Indexing</label>
          <input 
            type="text" 
            name="indexing" 
            value={formData.indexing} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Volume Number</label>
          <input 
            type="text" 
            name="volNo" 
            value={formData.volNo} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Page Number</label>
          <input 
            type="text" 
            name="pageNo" 
            value={formData.pageNo} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Year</label>
          <input 
            type="number" 
            name="year" 
            value={formData.year} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Publisher</label>
          <input 
            type="text" 
            name="publisher" 
            value={formData.publisher} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Is the Journal Paid?</label>
          <select 
            name="isPaid" 
            value={formData.isPaid} 
            onChange={handleChange}
            required
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div>
          <label>Paper Link</label>
          <input 
            type="url" 
            name="paperLink" 
            value={formData.paperLink} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>DOI</label>
          <input 
            type="text" 
            name="doi" 
            value={formData.doi} 
            onChange={handleChange} 
            required 
          />
        </div>
        {/* Add more fields as needed */}
        <button type="submit">Submit Research Paper</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default StudentDashboard;

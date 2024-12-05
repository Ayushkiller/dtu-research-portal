import React, { useState } from 'react';
import API from '../api/axios';
import './Login.css'; // You can create a separate CSS file for styles

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token } = response.data;

      localStorage.setItem('token', token); // Save token
      onLogin(); // Notify parent component
      alert('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid credentials.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <label className="input-label">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <label className="input-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">Login</button>
      </form>
    </div>
  );
}

export default Login;

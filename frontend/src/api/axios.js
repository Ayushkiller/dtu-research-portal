import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/', // Backend base URL
});

export default API;

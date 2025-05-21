import axios from 'axios';

// Detect backend URL automatically
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const BASE_URL = isLocalhost
  ? 'http://localhost:5001' // Local backend for development
  : `${window.location.origin.replace(/\/$/, '')}`; // Use same origin in production (e.g., Render)

// Create Axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`, // Prefix all requests with /api
  withCredentials: true, // Include cookies (e.g., JWT)
});

// Attach token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

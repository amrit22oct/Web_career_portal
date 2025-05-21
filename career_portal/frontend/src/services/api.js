import axios from 'axios';

// Automatically set backend URL based on environment
const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5001' // Your local backend port
    : import.meta.env.VITE_BACKEND_URL || 'https://your-production-backend-url.com'; // Use env variable in prod, fallback if missing

// Axios instance configuration
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // send cookies (e.g., JWT in cookie)
});

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

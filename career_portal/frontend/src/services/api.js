import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5001'
    : ''; // relative path in production

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

// Attach token from localStorage to Authorization header if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

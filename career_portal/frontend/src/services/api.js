import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5010' // backend running locally in dev
  : 'https://your-production-backend-url.com'; // replace with your deployed backend URL

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

import axios from "axios";

// Detect if running on localhost
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Set backend base URL dynamically
const BASE_URL = isLocalhost
  ? "http://localhost:5001" // Backend local dev port
  : `${window.location.origin.replace(/\/$/, "")}`; // Same origin in production

// Create Axios instance with base URL and credentials
const API = axios.create({
  baseURL: `${BASE_URL}/api`, // prefix all calls with /api
  withCredentials: true, // include cookies for auth
});

// Attach token from localStorage if exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

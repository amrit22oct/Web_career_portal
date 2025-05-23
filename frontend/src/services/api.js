import axios from "axios";

// Detect if running on localhost
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// In production, use relative path to ensure same-origin
const BASE_URL = isLocalhost ? "http://localhost:5001/api" : "/api";

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

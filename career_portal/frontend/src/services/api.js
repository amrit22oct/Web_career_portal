import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// In dev, use full backend URL; in production, just use relative URL because frontend and backend share origin
const BASE_URL = isLocalhost ? "http://localhost:5001" : "";

// Axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/api`, // in production, this becomes "/api"
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

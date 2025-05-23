import axios from "axios";

const BASE_URL = import.meta.env.MODE === "production"
  ? "" // same origin in production
  : "http://localhost:5001";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
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

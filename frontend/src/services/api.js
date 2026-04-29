import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "${getApiUrl()}";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

export const getApiUrl = () => API_BASE_URL;

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
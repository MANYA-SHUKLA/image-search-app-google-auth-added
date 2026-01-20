import axios from 'axios';

// Get API URL from environment variable
// In development with Vite proxy, use empty string (relative URLs)
// In production, use the full API URL
const API_URL = import.meta.env.VITE_API_URL || '';
const isDevelopment = import.meta.env.DEV;

// In development, use relative URLs (Vite proxy handles /api)
// In production, use the full API URL from env
const baseURL = isDevelopment ? '' : API_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
export const getApiUrl = () => API_URL;


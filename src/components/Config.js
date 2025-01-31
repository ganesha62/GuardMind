import axios from 'axios';
const API_BASE_URL = 'https://guardmind-backend-1.onrender.com';
// const API_BASE_URL = 'http://127.0.0.1:8000';
  export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
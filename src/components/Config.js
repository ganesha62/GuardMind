import axios from 'axios';
const API_BASE_URL = 'https://guardmind-backend-1.onrender.com';
   export const apiClient = axios.create({
     baseURL: API_BASE_URL,
   });

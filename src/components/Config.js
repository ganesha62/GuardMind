import axios from 'axios';
const API_BASE_URL = 'https://guardmind-backend.onrender.com';
   export const apiClient = axios.create({
     baseURL: API_BASE_URL,
   });

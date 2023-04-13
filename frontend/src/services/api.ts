import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_AMBIENT === 'DEV' ? 
  'http://localhost:8081' : 'https://fullstack-6s7y.onrender.com',
});

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  //console.log(token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(config);
  return config;
  
});

export default api;

import axios from 'axios';

// const baseURL = import.meta.env.PROD
//   ? 'http://localhost:5000/auth'
//   : 'http://localhost:5000/auth';

const axiosInstance = axios.create({
  baseURL : '/api',
  headers: {
    'Content-Type': 'application/json',
  }
  // withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

import axios from 'axios';
import toast from 'react-hot-toast';

let logoutHandler = null;

export const setApiLogoutHandler = (fn) => {
  logoutHandler = fn;
};

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';
// Replace localhost:5000 with 127.0.0.1:5000 to prevent macOS AirTunes 403 Forbidden intercept
if (rawBaseUrl.includes('localhost:5000')) {
  rawBaseUrl = rawBaseUrl.replace('localhost:5000', '127.0.0.1:5000');
}
const apiBase = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carelink_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Normalize url if it doesn't have /api prefix and isn't absolute
    if (config.url && !config.url.startsWith('http')) {
      if (!config.url.startsWith('/api') && !config.url.startsWith('api')) {
        config.url = `/api${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 errors, call logout, show Session expired toast
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const hadToken = !!(localStorage.getItem('carelink_token') || localStorage.getItem('token'));
      localStorage.removeItem('carelink_token');
      localStorage.removeItem('carelink_user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (logoutHandler) {
        logoutHandler();
      }

      if (hadToken && !window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

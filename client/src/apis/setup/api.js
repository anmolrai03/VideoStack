import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if we are checking auth status or already on auth pages
      const originalRequestUrl = error.config?.url || '';
      const isAuthCheck = originalRequestUrl.includes('/api/auth/me') || originalRequestUrl.includes('/api/auth/login');
      
      if (!isAuthCheck && window.location.pathname !== '/auth' && window.location.pathname !== '/') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios'
import config from './config.js'

// Get the API base URL from configuration
const getApiBaseUrl = () => {
  const apiUrl = config.getApiUrl();
  
  // Debug logging
  console.log('API Configuration:', {
    VITE_API_BASE: import.meta.env.VITE_API_BASE,
    MODE: import.meta.env.MODE,
    hostname: window.location.hostname,
    href: window.location.href,
    selectedApiUrl: apiUrl
  });
  
  return apiUrl;
};

const api = axios.create({ 
  baseURL: getApiBaseUrl(),
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for authentication
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  
  // Debug logging for requests
  console.log('API Request:', {
    method: cfg.method,
    url: cfg.url,
    baseURL: cfg.baseURL,
    fullURL: `${cfg.baseURL}${cfg.url}`
  });
  
  return cfg
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      }
    });
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - API server might be down');
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error - Unable to reach API server');
    }
    return Promise.reject(error);
  }
);

export default api

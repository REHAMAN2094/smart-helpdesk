// Configuration file for different environments
export const config = {
  // API Configuration
  api: {
    // Development - localhost
    development: 'http://localhost:8080',
    
    // Production - replace with your actual API server URL
    // TODO: Change this to your deployed API server URL
    production: 'https://smart-helpdesk-backend.onrender.com', // Temporary: change this after deploying your API server
    
    // Staging - if you have a staging environment
    staging: 'https://staging-api.your-domain.com'
  },
  

  
  // Get the appropriate API URL based on environment
  getApiUrl: () => {
    const env = import.meta.env.MODE || 'development';
    const envUrl = import.meta.env.VITE_API_BASE;
    
    // If VITE_API_BASE is set, use it (highest priority)
    if (envUrl) {
      return envUrl;
    }
    
    // Otherwise, use the config based on environment
    return config.api[env] || config.api.development;
  }
};

export default config;

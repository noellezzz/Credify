import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend runs on port 5000
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token to requests
    try {
      // First try to get organization session
      const storedSession = localStorage.getItem('supabase.auth.token');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      }
    } catch (error) {
      console.warn('Failed to parse stored session:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Axios error:", error);

    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      console.log('401 Unauthorized detected in axios interceptor');

      // Clear all auth data immediately
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('organizationAuth');

      // Redirect to organization login
      if (window.location.pathname.includes('/organization')) {
        window.location.href = '/organization/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

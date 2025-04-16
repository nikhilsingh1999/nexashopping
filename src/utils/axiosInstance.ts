import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://nexa-shopping-user-service.onrender.com',
  withCredentials: true, // IMPORTANT: required for cookie-based refresh!
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          // Backend will refresh using cookies
          await axiosInstance.get('/api/v1/user/auth/refresh');
  
          // Retry original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;
  
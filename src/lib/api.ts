import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': "*"
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const {getNewToken} = useAuthStore.getState()
        
        if (error.response?.status === 401) {
            if (error.response?.data?.message === "Token has expired") {
                await getNewToken()
                
                return new Promise(resolve => {
                    resolve(api(originalRequest));
                });
            }
        }
        
        return Promise.reject(error);
    }
);

export const customAxios = (contentType: string = 'application/json') => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    headers: {
      'Content-Type': contentType,
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.token = token
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};


export default api;
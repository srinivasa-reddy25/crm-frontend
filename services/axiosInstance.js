import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL+"/api" || 'http://localhost:3001/api',
    timeout: 10000, // 10 seconds
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = Cookies.get('auth');// You can change this to context or cookie if needed
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        const method = error.config?.method;
        const message = error.response?.data?.message || error.message || 'No error message';
        console.error('API Error →', `Status: ${status}, URL: ${method?.toUpperCase()} ${url}, Message: ${message}`);
        return Promise.reject(error);
    }
);


export default axiosInstance;
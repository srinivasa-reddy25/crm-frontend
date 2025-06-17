import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
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
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);


export default axiosInstance;
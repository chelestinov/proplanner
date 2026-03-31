import axios from 'axios';

const axiosInstance = axios.create({
    // Използваме директния адрес на бекенда
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost',
    
    // КРИТИЧНО ЗА 2FA: Променяме на true! 
    // Това позволява на Laravel да "запомни" кой си между екрана за вход и екрана за код.
    withCredentials: true, 
    
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json', // Добре е да го имаме за POST заявки
    },
});

/**
 * ИНТЕРСЕПТОР ЗА ЗАЯВКИ (Request)
 * Автоматично добавя Bearer Token към всяка заявка към бекенда
 */
axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        // Ако вече сме логнати и имаме токен, го добавяме
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

/**
 * ИНТЕРСЕПТОР ЗА ОТГОВОРИ (Response)
 * Справя се с изтекли сесии и грешки
 */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined') {
            const isAuthPage = window.location.pathname === '/login' || 
                               window.location.pathname === '/verify-2fa' || 
                               window.location.pathname === '/';
            
            // Ако сървърът върне 401 (Неоторизиран), чистим токена и пренасочваме
            if (error.response?.status === 401 && !isAuthPage) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
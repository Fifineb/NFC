// services/api/axiosConfig.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Intercepteur pour ajouter le token à TOUTES les requêtes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('🔑 Token dans intercepteur:', token ? 'Présent' : 'ABSENT');
        console.log('📍 URL:', config.url);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token ajouté à la requête');
        } else {
            console.log('❌ PAS DE TOKEN !');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;


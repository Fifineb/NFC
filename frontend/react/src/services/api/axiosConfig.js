import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Service pour les régions
export const regionService = {
    getAll: () => api.get('/region/getAll'),
    getById: (id) => api.get(`/region/getById/${id}`),
    add: (data) => api.post('/region/add', data),
    update: (id, data) => api.put(`/region/update/${id}`, data),
    delete: (id) => api.delete(`/region/delete/${id}`),
};

// Service pour les magasins
export const magasinService = {
    getAll: () => api.get('/magasin/getAll'),
    add: (data) => api.post('/magasin/add', data),
};

export default api;

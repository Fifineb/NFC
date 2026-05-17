import api from './axiosConfig';

export const regionApi = {
    getAll: async () => {
        const response = await api.get('/api/region/getAll');
        return response.data;
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/region/get/${id}`);
        return response.data;
    },
    
    add: async (data) => {
        const response = await api.post('/api/region/add', data);
        return response.data;
    },
    
    update: async (id, data) => {
        const response = await api.put(`/api/region/update/${id}`, data);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/region/delete/${id}`);
        return response.data;
    }
};
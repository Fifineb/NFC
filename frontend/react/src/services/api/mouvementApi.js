import api from './axiosConfig';

export const mouvementApi = {
    getAll: async () => {
        const response = await api.get('/api/mouvements');
        return response.data;
    },
    
    getRecents: async () => {
        const response = await api.get('/api/mouvements/recent');
        return response.data;
    },
    
    create: async (mouvement) => {
        const response = await api.post('/api/mouvements', mouvement);
        return response.data;
    }
};
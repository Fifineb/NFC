import api from './axiosConfig';

export const bonEntreeApi = {

    getAll: async () => {
        const response = await api.get('/api/bon-entree');
        return response.data;
    },

  /*  getRecent: async () => {
        const response = await api.get('/api/bon-entree/recent');
        return response.data;
    },*/

    getById: async (id) => {
        const response = await api.get(`/api/bon-entree/${id}`);
        return response.data;
    },

    create: async (bonEntree) => {
        const response = await api.post('/api/bon-entree', bonEntree);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/api/bon-entree/${id}`);
    }
};

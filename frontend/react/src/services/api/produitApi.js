
import api from './axiosConfig';

export const produitApi = {
    getAll: async () => {
        const response = await api.get('/api/produits');
        return response.data;
    },
    
    getById: async (id) => {
        const response = await api.get(`/api/produits/${id}`);
        return response.data;
    },
    
    create: async (produit) => {
        const response = await api.post('/api/produits', produit);
        return response.data;
    },
    
    update: async (id, produit) => {
        const response = await api.put(`/api/produits/${id}`, produit);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/produits/${id}`);
        return response.data;
    },
    
    updateStock: async (id, quantite) => {
        const response = await api.patch(`/api/produits/${id}/stock`, { quantite });
        return response.data;
    }
};

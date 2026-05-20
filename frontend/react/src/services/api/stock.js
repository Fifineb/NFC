
import api from './axiosConfig';

export const stockService = {
    // Récupérer tous les stocks
    getAll: async () => {
        try {
            // Essaie différentes URLs
            const response = await api.get('/api/stock/getAll');
            return response.data;
        } catch (error) {
            console.error('Erreur stock getAll:', error);
            throw error;
        }
    },
    
    // Récupérer un stock par ID
    getById: async (id) => {
        const response = await api.get(`/api/stock/get/${id}`);
        return response.data;
    },
    
    // Vérifier le seuil d'un stock
    verifierSeuil: async (id) => {
        const response = await api.get(`/api/stock/${id}/verifier-seuil`);
        return response.data;
    },
    
    // Augmenter la quantité
    augmenter: async (id, quantite) => {
        const response = await api.post(`/api/stock/${id}/augmenter`, { quantite });
        return response.data;
    },
    
    // Diminuer la quantité
    diminuer: async (id, quantite) => {
        const response = await api.post(`/api/stock/${id}/diminuer`, { quantite });
        return response.data;
    }
};

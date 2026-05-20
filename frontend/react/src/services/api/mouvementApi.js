import api from './axiosConfig';

export const mouvementApi = {
    // Récupérer tous les mouvements
    getAll: async () => {
        const response = await api.get('/api/mouvements');
        return response.data;
    },
    
    // Récupérer un mouvement par ID
    getById: async (id) => {
        const response = await api.get(`/api/mouvements/${id}`);
        return response.data;
    },
    
    // Récupérer les mouvements d'un stock
    getByStock: async (stockId) => {
        const response = await api.get(`/api/mouvements/stock/${stockId}`);
        return response.data;
    },
    
    // Créer un bon d'entrée
    createBonEntree: async (bonEntree) => {
        const response = await api.post('/api/mouvements/bon-entree', bonEntree);
        return response.data;
    },
    
    // Créer un bon de sortie
    createBonSortie: async (bonSortie) => {
        const response = await api.post('/api/mouvements/bon-sortie', bonSortie);
        return response.data;
    },
    
    // Créer un bon de consommation
    createBonConsommation: async (bonConsommation) => {
        const response = await api.post('/api/mouvements/bon-consommation', bonConsommation);
        return response.data;
    },
    
    // Supprimer un mouvement
    delete: async (id) => {
        await api.delete(`/api/mouvements/${id}`);
    }
};
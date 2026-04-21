import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const bonEntreeApi = {
    // Récupérer tous les bons d'entrée
    getAll: async () => {
        const response = await axios.get(`${API_URL}/bon-entree/all`);
        return response.data;
    },
    
    // Récupérer les bons d'entrée récents
    getRecent: async () => {
        const response = await axios.get(`${API_URL}/bon-entree/recent`);
        return response.data;
    },
    
    // Récupérer un bon d'entrée par ID
    getById: async (id) => {
        const response = await axios.get(`${API_URL}/bon-entree/${id}`);
        return response.data;
    },
    
    // Créer un bon d'entrée
    create: async (bonEntree) => {
        const response = await axios.post(`${API_URL}/bon-entree/create`, bonEntree);
        return response.data;
    },
    
    // Supprimer un bon d'entrée
    delete: async (id) => {
        await axios.delete(`${API_URL}/bon-entree/${id}`);
    }
};

export const demandeAchatApi = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/demande-achat/all`);
        return response.data;
    },
    
    getUrgentes: async () => {
        const response = await axios.get(`${API_URL}/demande-achat/urgentes`);
        return response.data;
    },
    
    getByStatut: async (statut) => {
        const response = await axios.get(`${API_URL}/demande-achat/statut/${statut}`);
        return response.data;
    },
    
    create: async (demande) => {
        const response = await axios.post(`${API_URL}/demande-achat/create`, demande);
        return response.data;
    }
};
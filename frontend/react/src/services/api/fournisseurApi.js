import api from './axiosConfig';

    export const fournisseurApi = {
    
    getAll: async () => {
    const response = await api.get('/api/fournisseur/getAll');

    console.log("🔥 RESPONSE:", response.data);

    // Cas normal : tableau direct
    if (Array.isArray(response.data)) {
        return response.data;
    }

    // Cas Spring Boot pagination/content
    if (response.data?.content && Array.isArray(response.data.content)) {
        return response.data.content;
    }

    // Cas objet unique
    if (response.data && typeof response.data === 'object') {
        return [response.data];
    }

      return [];
    },

    getById: async (id) => {
        const response = await api.get(`/api/fournisseur/${id}`);
        return response.data;
    },

    add: async (fournisseur) => {
        const response = await api.post('/api/fournisseur/add', fournisseur);
        return response.data;
    },
    update: async (id, fournisseur) => {
        const response = await api.put(`/api/fournisseur/update/${id}`, fournisseur);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/api/fournisseur/delete/${id}`);
        return response.data;
    }
};
import api from './axiosConfig';

export const fournisseurApi = {
    getAll: async () => {
        const response = await api.get('/fournisseur/getAll');  
        return response.data;
    },
    
    getById: async (id) => {
    const response = await api.get(`/fournisseur/${id}`);
    return response.data;
    },
    
   create: async (fournisseur) => {
        const response = await api.post('/fournisseur/add', fournisseur);  
        return response.data;
    },
    
    update: async (id, fournisseur) => {
        const response = await api.put(`/fournisseur/update/${id}`, fournisseur);  
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/fournisseur/delete/${id}`);  
        return response.data;
    }
};
import api from './axiosConfig';
import axios from 'axios';


const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const rapportApi = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/rapport/getAll`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Erreur getAll rapports:', error.response?.data || error.message);
            throw error;
        }
    },
    
    getByUser: async () => {
        const response = await api.get('/api/rapports/mes-rapports');
        return response.data;
    },
    
    create: async (rapport) => {
        const response = await api.post('/api/rapports', rapport);
        return response.data;
    },
    
    validate: async (id) => {
        const response = await api.put(`/api/rapports/${id}/valider`);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/api/rapports/${id}`);
        return response.data;
    }
};
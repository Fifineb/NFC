import api from './axiosConfig';

export const userService = {
    // Récupérer le profil utilisateur
    getProfile: async () => {
        const response = await api.get('/api/utilisateurs/me');
        return response.data;
    },
    
    //METTRE A JOUR LE PROFIL
    updateProfile: async (userData) => {
        console.log('📤 userService.updateProfile appelé avec:', userData);
        const response = await api.put('/api/utilisateurs/profile', userData);
        console.log('📥 Réponse reçue:', response);
        return response.data;
    },
    

    // Changer le mot de passe
    changePassword: async (passwordData) => {
        const response = await api.put('/api/utilisateurs/change-password', passwordData);
        return response.data;
    },
    
    // Mettre à jour l'utilisateur
    updateUser: async (id, userData) => {
        const response = await api.put(`/api/utilisateurs/${id}`, userData);
        return response.data;
    }
};
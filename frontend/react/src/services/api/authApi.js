import api from './axiosConfig';

export const authApi = {
   login: async (email, motDePasse) => {
    try {
        const res = await api.post('/auth/login', { email, motDePasse });

        console.log("📦 Réponse backend:", res.data);

        const data = res.data;

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, user: data.user };
        }

        return { success: false, message: data.message };

    } catch (err) {
        return {
            success: false,
            message: "Email ou mot de passe incorrect"
        };
    }
},
    
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    }
};

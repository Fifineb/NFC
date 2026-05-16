// /src/services/api/userService.js
const API_BASE_URL = 'http://localhost:8081';

export const userService = {
    // Connexion
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }
        
        return response.json();
    },
    
    // Inscription
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }
        
        return response.json();
    },
    
    // Récupérer profil
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        return response.json();
    },
    
    // Mettre à jour profil
    updateProfile: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/user/updateProfile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Update failed');
        }
        
        return response.json();
    },
    
    // Changer mot de passe
    changePassword: async (passwordData) => {
        const response = await fetch(`${API_BASE_URL}/user/changePassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(passwordData)
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Password change failed');
        }
        
        return response.text();
    }
};
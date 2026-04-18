// src/services/api.js
const API_BASE_URL = 'http://localhost:8081';

export const regionService = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/region/getAll`);
        return response.json();
    },
    
    add: async (region) => {
        const response = await fetch(`${API_BASE_URL}/region/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(region)
        });
        return response.text();
    }
};

export const magasinService = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/magasin/getAll`);
        return response.json();
    },
    
    add: async (magasin) => {
        const response = await fetch(`${API_BASE_URL}/magasin/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(magasin)
        });
        return response.text();
    }
};

// /src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // ✅ Fonction hasRole - AJOUTÉE !
    const hasRole = (roles) => {
        if (!user) return false;
        // Si roles est un tableau, vérifier si le rôle de l'utilisateur est dans le tableau
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        // Sinon, vérifier si le rôle correspond
        return user.role === roles;
    };

    // ✅ Fonction hasPermission - AJOUTÉE pour les permissions avancées
    const hasPermission = (permission) => {
        if (!user) return false;
        // Définition des permissions par rôle
        const permissions = {
            'ADMIN': ['*'], // Toutes les permissions
            'GESTIONNAIRE': ['view_suppliers', 'edit_suppliers', 'add_suppliers', 'delete_suppliers', 'view_produits', 'edit_produits'],
            'SUPERVISEUR': ['view_suppliers', 'view_produits', 'view_reports'],
            'MAGASINIER': ['view_produits', 'edit_stock']
        };
        
        const userPermissions = permissions[user.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    };

    const login = async (credentials) => {
        try {
            console.log('🔐 Tentative de connexion avec:', {
                email: credentials.email,
                password: credentials.password
            });

            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: credentials.email,
                    motDePasse: credentials.password
                })
            });

            console.log('📡 Status réponse:', response.status);
            
            const data = await response.json();
            console.log('📦 Données reçues:', data);

            if (!response.ok) {
                const errorMsg = data.message || data.error || 'Email ou mot de passe incorrect';
                throw new Error(errorMsg);
            }

            if (data.success && data.token) {
                const userData = {
                    id: data.userId,
                    email: data.email,
                    nom: data.nom,
                    prenom: data.prenom,
                    role: data.role
                };

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                addNotification({
                    message: `Bienvenue ${data.prenom || data.nom || 'Utilisateur'}`,
                    type: 'success'
                });

                return { success: true, user: userData };
            } else {
                throw new Error(data.message || 'Connexion échouée');
            }
        } catch (error) {
            console.error('❌ Login API error:', error);
            addNotification({
                message: error.message,
                type: 'error'
            });
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        addNotification({
            message: 'Déconnecté avec succès',
            type: 'info'
        });
    };

    const addNotification = (notification) => {
        const id = Date.now();
        setNotifications(prev => [...prev, {
            id,
            ...notification,
            timestamp: new Date()
        }]);
        
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const value = {
        user,
        loading,
        login,
        logout,
        notifications,
        addNotification,
        removeNotification,
        hasRole,       
        hasPermission   
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
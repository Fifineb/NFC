// context/NotificationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Ajouter une notification
    const addNotification = useCallback((notification) => {
        const id = Date.now();
        const newNotification = {
            id,
            message: notification.message,
            type: notification.type || 'info', // 'success', 'error', 'warning', 'info'
            title: notification.title || '',
            read: false,
            timestamp: new Date(),
            link: notification.link || null,
            autoClose: notification.autoClose !== false, // par défaut true
            duration: notification.duration || 5000, // 5 secondes par défaut
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Auto-fermeture
        if (newNotification.autoClose) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    // Supprimer une notification
    const removeNotification = useCallback((id) => {
        setNotifications(prev => {
            const notification = prev.find(n => n.id === id);
            if (notification && !notification.read) {
                setUnreadCount(count => Math.max(0, count - 1));
            }
            return prev.filter(n => n.id !== id);
        });
    }, []);

    // Marquer une notification comme lue
    const markAsRead = useCallback((id) => {
        setNotifications(prev => {
            const notification = prev.find(n => n.id === id);
            if (notification && !notification.read) {
                setUnreadCount(count => Math.max(0, count - 1));
            }
            return prev.map(n => 
                n.id === id ? { ...n, read: true } : n
            );
        });
    }, []);

    // Marquer toutes les notifications comme lues
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
        );
        setUnreadCount(0);
    }, []);

    // Supprimer toutes les notifications
    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    // Notification de succès
    const showSuccess = useCallback((message, title = 'Succès', duration = 5000) => {
        return addNotification({
            message,
            title,
            type: 'success',
            duration
        });
    }, [addNotification]);

    // Notification d'erreur
    const showError = useCallback((message, title = 'Erreur', duration = 6000) => {
        return addNotification({
            message,
            title,
            type: 'error',
            duration
        });
    }, [addNotification]);

    // Notification d'avertissement
    const showWarning = useCallback((message, title = 'Attention', duration = 5000) => {
        return addNotification({
            message,
            title,
            type: 'warning',
            duration
        });
    }, [addNotification]);

    // Notification d'information
    const showInfo = useCallback((message, title = 'Information', duration = 4000) => {
        return addNotification({
            message,
            title,
            type: 'info',
            duration
        });
    }, [addNotification]);

    // Notification d'alerte stock
    const showStockAlert = useCallback((produit, stockActuel, seuil) => {
        return addNotification({
            message: `Le stock de "${produit}" est bas (${stockActuel} ${seuil})`,
            title: '⚠️ Alerte Stock',
            type: 'warning',
            link: '/listestock',
            duration: 8000
        });
    }, [addNotification]);

    // Notification de mouvement de stock
    const showMovementAlert = useCallback((type, produit, quantite) => {
        const movementType = type === 'entree' ? '📥 Entrée' : '📤 Sortie';
        return addNotification({
            message: `${movementType} : ${quantite} de ${produit} enregistrée`,
            title: 'Mouvement de stock',
            type: 'info',
            link: '/mouvements',
            duration: 4000
        });
    }, [addNotification]);

    // Valeur du contexte
    const value = {
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showStockAlert,
        showMovementAlert
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
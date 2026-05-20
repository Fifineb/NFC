// composantes/common/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';
import { BiBell, BiCheck, BiX, BiTrash } from 'react-icons/bi';
import '../../assets/styles/notifications.css';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications, removeNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIconByType = (type) => {
        switch(type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `${minutes} min`;
        if (hours < 24) return `${hours} h`;
        return `${days} j`;
    };

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button 
                className="bell-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <BiBell className="bell-icon" />
                {unreadCount > 0 && (
                    <span className="badge-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <div className="header-actions">
                            {notifications.length > 0 && (
                                <>
                                    <button onClick={markAllAsRead} className="header-btn" title="Tout marquer comme lu">
                                        <BiCheck /> Tout lire
                                    </button>
                                    <button onClick={clearAllNotifications} className="header-btn" title="Effacer tout">
                                        <BiTrash /> Effacer
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <BiBell />
                                <p>Aucune notification</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    className={`notification-item ${!notif.read ? 'unread' : ''} type-${notif.type}`}
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    <div className="notification-icon">
                                        {getIconByType(notif.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notif.title && <span className="title">{notif.title}</span>}
                                            <span className="time">{formatTime(notif.timestamp)}</span>
                                        </div>
                                        <div className="notification-message">{notif.message}</div>
                                        {notif.link && (
                                            <Link to={notif.link} className="notification-link">
                                                Voir détails →
                                            </Link>
                                        )}
                                    </div>
                                    <button 
                                        className="notification-close"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notif.id);
                                        }}
                                    >
                                        <BiX />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
//import './NotificationBell.css';

const NotificationBell = () => {
    const { notifications, markNotificationAsRead } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    return (
        <div className="notification-container">
            <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
                🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            
            {isOpen && (
                <div className="notification-dropdown">
                    <h3>Notifications</h3>
                    {notifications?.length === 0 ? (
                        <p>Aucune notification</p>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                <p>{notif.message}</p>
                                <small>{new Date(notif.date).toLocaleString()}</small>
                                {!notif.read && (
                                    <button onClick={() => markNotificationAsRead(notif.id)}>✓</button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
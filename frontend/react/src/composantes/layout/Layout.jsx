// composantes/layout/Layout.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

import Sidebar from '../common/Sidebar';  // ← Utiliser ton Sidebar
import NotificationBell from '../common/NotificationBell';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import '../../assets/styles/layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [openProfile, setOpenProfile] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            {/* TON SIDEBAR ICI */}
            <Sidebar />

            {/* MAIN */}
            <div className="main-section">
                {/* HEADER */}
                <header className="topbar">
                    <div className="topbar-left">
                        Bienvenue {user?.prenom}
                    </div>

                    <div className="topbar-right">
                        <NotificationBell />

                        <button
                            className="profile-button"
                            onClick={() => setOpenProfile(!openProfile)}
                        >
                            <div className="profile-avatar">
                                {user?.prenom?.charAt(0)}
                            </div>
                            <div className="profile-info">
                                <span>{user?.prenom} {user?.nom}</span>
                                <small>{user?.role}</small>
                            </div>
                        </button>

                        {openProfile && (
                            <div className="profile-dropdown">
                                <div className="profile-dropdown-header">
                                    <div className="profile-avatar big">
                                        {user?.prenom?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4>{user?.prenom} {user?.nom}</h4>
                                        <p>{user?.email}</p>
                                    </div>
                                </div>
                                <div className="profile-dropdown-content">
                                    <Link to="/profile" className="dropdown-item">👤 Mon Profil</Link>
                                    <div className="dropdown-item">🌍 <LanguageSwitcher /></div>
                                    <div className="dropdown-item">🌙 <ThemeSwitcher /></div>
                                    <button onClick={handleLogout} className="logout-button">🚪 Déconnexion</button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* PAGE */}
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

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

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getMenuItems = () => {

        const role = user?.role;

        if (role === 'ADMINISTRATEUR') {
            return [
                { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
                { path: '/produits', label: 'Produits', icon: '📦' },
                { path: '/fournisseurs', label: 'Fournisseurs', icon: '🏭' },
                { path: '/regions', label: 'Régions', icon: '🌍' },
                { path: '/rapports', label: 'Rapports', icon: '📄' },
                { path: '/listestock', label: 'Stock', icon: '📋' },
                { path: '/message', label: 'Messages', icon: '💬' },
                { path: '/profile', label: 'Profil', icon: '👤' },
            ];
        }

        if (role === 'GESTIONNAIRE') {
            return [
                { path: '/manager/dashboard', label: 'Dashboard', icon: '📊' },
                { path: '/produits', label: 'Produits', icon: '📦' },
                { path: '/fournisseurs', label: 'Fournisseurs', icon: '🏭' },
                { path: '/rapports', label: 'Rapports', icon: '📄' },
                { path: '/bon-entree', label: 'Bon Entrée', icon: '📥' },
                { path: '/message', label: 'Messages', icon: '💬' },
                { path: '/profile', label: 'Profil', icon: '👤' },
            ];
        }

        if (role === 'MAGASINIER') {
            return [
                { path: '/stocker/dashboard', label: 'Dashboard', icon: '📊' },
                { path: '/produits', label: 'Produits', icon: '📦' },
                { path: '/bon-entree', label: 'Bon Entrée', icon: '📥' },
                { path: '/listestock', label: 'Stock', icon: '📋' },
                { path: '/profile', label: 'Profil', icon: '👤' },
            ];
        }

        if (role === 'SUPERVISEUR') {
            return [
                { path: '/supervisor/dashboard', label: 'Dashboard', icon: '📊' },
                { path: '/produits', label: 'Produits', icon: '📦' },
                { path: '/rapports', label: 'Rapports', icon: '📄' },
                { path: '/profile', label: 'Profil', icon: '👤' },
            ];
        }

        return [];
    };

    return (

        <div className="layout-container">

            {/* SIDEBAR */}

            <aside className="sidebar-modern">

                <div className="sidebar-logo">
                    SmartStock
                </div>

                <nav className="sidebar-nav">

                    {getMenuItems().map((item) => (

                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>

                    ))}

                </nav>

            </aside>

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

                                    <Link to="/profile" className="dropdown-item">
                                        👤 Mon Profil
                                    </Link>

                                    <div className="dropdown-item">
                                        🌍 <LanguageSwitcher />
                                    </div>

                                    <div className="dropdown-item">
                                        🌙 <ThemeSwitcher />
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="logout-button"
                                    >
                                        🚪 Déconnexion
                                    </button>

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

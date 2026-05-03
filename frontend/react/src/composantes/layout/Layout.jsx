import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../common/NotificationBell';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
//import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getMenuItems = () => {
        const role = user?.role;
        const commonItems = [
            { path: '/profile', label: t('nav.profile'), icon: '👤' }
        ];

        if (role === 'ADMINISTRATEUR') {
            return [
                { path: '/Dashboard', label: t('nav.dashboard'), icon: '📊' },
                { path: '/produits', label: t('nav.products'), icon: '📦' },
                { path: '/fournisseurs', label: t('nav.suppliers'), icon: '🏭' },
                { path: '/rapports', label: t('nav.reports'), icon: '📄' },
                { path: '/stock', label: t('nav.stock'), icon: '📊' },
                { path: '/regions', label: t('nav.regions'), icon: '🌍' },
                ...commonItems
            ];
        }
        
        if (role === 'GESTIONNAIRE') {
            return [
                { path: '/manager/dashboard', label: t('nav.dashboard'), icon: '📊' },
                { path: '/produits', label: t('nav.products'), icon: '📦' },
                { path: '/fournisseurs', label: t('nav.suppliers'), icon: '🏭' },
                { path: '/rapports', label: t('nav.reports'), icon: '📄' },
                { path: '/bon-entree', label: t('nav.bon_entree'), icon: '📥' },
                ...commonItems
            ];
        }
        
        if (role === 'MAGASINIER') {
            return [
                { path: '/stocker/dashboard', label: t('nav.dashboard'), icon: '📊' },
                { path: '/produits', label: t('nav.products'), icon: '📦' },
                { path: '/bon-entree', label: t('nav.bon_entree'), icon: '📥' },
                ...commonItems
            ];
        }
        
        if (role === 'SUPERVISEUR') {
            return [
                { path: '/supervisor/dashboard', label: t('nav.dashboard'), icon: '📊' },
                { path: '/produits', label: t('nav.products'), icon: '📦' },
                { path: '/rapports', label: t('nav.reports'), icon: '📄' },
                ...commonItems
            ];
        }
        
        return commonItems;
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="logo">
                    <Link to="/">SmartStock</Link>
                </div>
                <div className="header-right">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                    <NotificationBell />
                    <span className="user-info">
                        {user?.prenom} {user?.nom}
                        <small className="user-role">({user?.role})</small>
                    </span>
                    <button onClick={handleLogout} className="logout-btn">
                        {t('nav.logout')}
                    </button>
                </div>
            </header>
            
            <div className="app-body">
                <aside className="app-sidebar">
                    <nav>
                        {getMenuItems().map(item => (
                            <Link key={item.path} to={item.path} className="menu-item">
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-label">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                
                <main className="app-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

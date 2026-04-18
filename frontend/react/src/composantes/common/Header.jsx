// src/composantes/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ nom: '', prenom: '', email: '', role: '' });
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Récupérer les informations de l'utilisateur depuis localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Erreur lors du parsing user data:', e);
            }
        } else {
            // Données de test (à remplacer par les vraies données après connexion)
            setUser({
                nom: 'Admin',
                prenom: 'System',
                email: 'admin@stock.com',
                role: 'ADMINISTRATEUR'
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getInitials = () => {
        if (user.nom && user.prenom) {
            return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
        }
        if (user.nom) {
            return user.nom.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const getRoleBadge = () => {
        const roleColors = {
            'ADMINISTRATEUR': '#ef4444',
            'GESTIONNAIRE': '#f59e0b',
            'SUPERVISEUR': '#10b981',
            'MAGASINIER': '#3b82f6'
        };
        return roleColors[user.role] || '#6b7280';
    };

    const getRoleName = () => {
        const roleNames = {
            'ADMINISTRATEUR': 'Admin',
            'GESTIONNAIRE': 'Gestionnaire',
            'SUPERVISEUR': 'Superviseur',
            'MAGASINIER': 'Magasinier'
        };
        return roleNames[user.role] || user.role;
    };

    return (
        <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            {/* Logo / Titre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#0f4c81',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        Smart Stock
                    </h1>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                        Gestion de Stock
                    </p>
                </div>
            </div>

            {/* Navigation rapide */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: location.pathname === '/dashboard' ? '#0f4c81' : '#4b5563',
                        fontWeight: location.pathname === '/dashboard' ? '600' : '400',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => navigate('/stock')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: location.pathname === '/stock' ? '#0f4c81' : '#4b5563',
                        fontWeight: location.pathname === '/stock' ? '600' : '400',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '6px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Stock
                </button>
                <button
                    onClick={() => navigate('/regions')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: location.pathname === '/regions' ? '#0f4c81' : '#4b5563',
                        fontWeight: location.pathname === '/regions' ? '600' : '400',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '6px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    Régions
                </button>
            </div>

            {/* Profil utilisateur */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '30px',
                        transition: 'all 0.2s',
                        backgroundColor: showUserMenu ? '#f3f4f6' : 'transparent'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => {
                        if (!showUserMenu) e.target.style.backgroundColor = 'transparent';
                    }}
                >
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            {user.prenom} {user.nom}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {getRoleName()}
                        </div>
                    </div>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: getRoleBadge(),
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}>
                        {getInitials()}
                    </div>
                </button>

                {/* Menu déroulant */}
                {showUserMenu && (
                    <>
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 98
                            }}
                            onClick={() => setShowUserMenu(false)}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            width: '280px',
                            zIndex: 99,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                        }}>
                            {/* Info utilisateur */}
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#f8fafc',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: getRoleBadge(),
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '20px'
                                    }}>
                                        {getInitials()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
                                            {user.prenom} {user.nom}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {user.email}
                                        </div>
                                        <span style={{
                                            fontSize: '10px',
                                            backgroundColor: getRoleBadge(),
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            display: 'inline-block',
                                            marginTop: '4px'
                                        }}>
                                            {getRoleName()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div style={{ padding: '8px 0' }}>
                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 16px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
                                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Mon profil</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/settings');
                                        setShowUserMenu(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 16px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
                                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Paramètres</span>
                                </button>
                                <hr style={{ margin: '8px 0', borderColor: '#e5e7eb' }} />
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 16px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        color: '#dc2626',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
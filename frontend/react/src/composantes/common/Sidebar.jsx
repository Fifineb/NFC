import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    BiHome, BiMessage, BiSolidReport, BiStats, BiTask, 
    BiBookAlt, BiMenu, BiUserPlus, BiStore, BiUser,
    BiMap, BiPackage, BiBarChartAlt2
} from 'react-icons/bi';
import '../../assets/styles/menu.css';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const role = user?.role;

    const isActive = (path) => location.pathname === path;

    // Menu selon le rôle
    const getMenuItems = () => {
        // Menu de base (commun à tous)
        const baseItems = [
            { path: "/dashboard", label: "Dashboard", icon: <BiHome />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE', 'MAGASINIER', 'SUPERVISEUR'] },
            { path: "/listestock", label: "Stock", icon: <BiBookAlt />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE', 'MAGASINIER'] },
            { path: "/mouvements", label: "Mouvements", icon: <BiTask />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE', 'MAGASINIER', 'SUPERVISEUR'] },
            { path: "/profile", label: "Profil", icon: <BiUser />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE', 'MAGASINIER', 'SUPERVISEUR'] },
        ];
        

        // Items spécifiques ADMIN
        const adminItems = [
            { path: "/produits", label: "Produits", icon: <BiPackage />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE'] },
            { path: "/fournisseurs", label: "Fournisseurs", icon: <BiStore />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE'] },
            { path: "/regions", label: "Régions", icon: <BiMap />, roles: ['ADMINISTRATEUR'] },
            { path: "/rapports", label: "Rapports", icon: <BiSolidReport />, roles: ['ADMINISTRATEUR', 'GESTIONNAIRE', 'SUPERVISEUR'] },
            { path: "/adduser", label: "Add User", icon: <BiUserPlus />, roles: ['ADMINISTRATEUR'] },
            { path: "/stats", label: "Statistics", icon: <BiStats />, roles: ['ADMINISTRATEUR', 'SUPERVISEUR'] },
        ];

        // Items spécifiques MANAGER
        const managerItems = [
            { path: "/produits", label: "Produits", icon: <BiPackage />, roles: ['GESTIONNAIRE'] },
            { path: "/fournisseurs", label: "Fournisseurs", icon: <BiStore />, roles: ['GESTIONNAIRE'] },
            { path: "/rapports", label: "Rapports", icon: <BiSolidReport />, roles: ['GESTIONNAIRE'] },
            { path: "/bon-entree", label: "Bon Entrée", icon: <BiTask />, roles: ['GESTIONNAIRE'] },
        ];

        // Items spécifiques MAGASINIER
        const stockerItems = [
            { path: "/bon-entree", label: "Bon Entrée", icon: <BiTask />, roles: ['MAGASINIER'] },
        ];

        // Items spécifiques SUPERVISEUR
        const supervisorItems = [
            { path: "/rapports", label: "Rapports", icon: <BiSolidReport />, roles: ['SUPERVISEUR'] },
            { path: "/stats", label: "Statistics", icon: <BiStats />, roles: ['SUPERVISEUR'] },
        ];

        let items = [...baseItems];

        if (role === 'ADMINISTRATEUR') {
            items = [...items, ...adminItems];
        } else if (role === 'GESTIONNAIRE') {
            items = [...items, ...managerItems];
        } else if (role === 'MAGASINIER') {
            items = [...items, ...stockerItems];
        } else if (role === 'SUPERVISEUR') {
            items = [...items, ...supervisorItems];
        }

        // Filtrer par rôle et supprimer les doublons
        const uniqueItems = items.filter((item, index, self) => 
            index === self.findIndex(i => i.path === item.path)
        );

        return uniqueItems;
    };

    const menuItems = getMenuItems();

    return (
        <div className={`menu ${open ? "active" : "close"}`}>
            <div className='menu--header'>
                <BiMenu className='icon' onClick={() => setOpen(!open)} />
                {open && <h2>Smart Stock</h2>}
            </div>

            <div className="menu--list">
                {menuItems.map((item) => (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <span className='icon'>{item.icon}</span> 
                        {open && <span>{item.label}</span>}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
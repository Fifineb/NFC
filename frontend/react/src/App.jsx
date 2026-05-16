
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './routes/PrivateRoute';
import Layout from './composantes/layout/Layout';
import LoadingSpinner from './composantes/common/LoadingSpinner';

// Import des pages
import Login from './Pages/auth/Login';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import ManagerDashboard from './Pages/Dashboard/ManagerDashboard';
import StockerDashboard from './Pages/Dashboard/StockerDashboard';
import SupervisorDashboard from './Pages/Dashboard/SupervisorDashboard';
import Produits from './Pages/private/Produits';
import Suppliers from './Pages/private/Suppliers';
import BonEntree from './Pages/private/BonEntree';
import Rapport from './Pages/private/Rapport';
import Regions from './Pages/private/Regions';
import Profile from './composantes/common/Profile';
import Home from './Pages/public/Home';
import Contact from './Pages/public/Contact';
import NousContact from './Pages/public/Nouscontacter';
import Register from './Pages/public/Register';
import ScrollToTop from './composantes/common/ScrollToTop';
import Rapport from './Pages/private/Rapport';
import HomeUSER from './Pages/private/Home';
import Listestock from './Pages/private/Listestock'
import Message from './Pages/private/Message'


import './assets/styles/global.css';
import './i18n';

function AppRoutes() {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    
    if (!user) {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/NousContact" element={<NousContact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }
    
    const role = user.role;
    
    // Routes ADMIN
    if (role === 'ADMINISTRATEUR') {
        return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/produits" element={<Produits />} />
                    <Route path="/fournisseurs" element={<Suppliers />} />
                    <Route path="/rapports" element={<Rapport />} />
                    <Route path="/stock" element={<BonEntree />} />
                    <Route path="/regions" element={<Regions />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<HomeUSER />} />
                    <Route path="/listestock" element={<Listestock />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/rapport" element={<Rapport />} />
                </Routes>
            </Layout>
        );
    }
    
    // Routes GESTIONNAIRE
    if (role === 'GESTIONNAIRE') {
        return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/manager/dashboard" />} />
                    <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                    <Route path="/produits" element={<Produits />} />
                    <Route path="/fournisseurs" element={<Suppliers />} />
                    <Route path="/rapport" element={<Rapport />} />
                    <Route path="/bon-entree" element={<BonEntree />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<HomeUSER />} />
                    <Route path="/listestock" element={<Listestock />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/rapport" element={<Rapport />} />
                </Routes>
            </Layout>
        );
    }
    
    // Routes MAGASINIER
    if (role === 'MAGASINIER') {
        return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/stocker/dashboard" />} />
                    <Route path="/stocker/dashboard" element={<StockerDashboard />} />
                    <Route path="/produits" element={<Produits readOnly />} />
                    <Route path="/bon-entree" element={<BonEntree />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<HomeUSER />} />
                    <Route path="/listestock" element={<Listestock />} />
                    <Route path="/message" element={<Message />} />
                </Routes>
            </Layout>
        );
    }
    
    // Routes SUPERVISEUR
    if (role === 'SUPERVISEUR') {
        return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/supervisor/dashboard" />} />
                    <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
                    <Route path="/produits" element={<Produits readOnly />} />
                    <Route path="/rapports" element={<Rapport />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<HomeUSER />} />
                    <Route path="/listestock" element={<Listestock />} />
                    <Route path="/message" element={<Message />} />
                    <Route path="/rapport" element={<Rapport />} />
                </Routes>
            </Layout>
        );
    }
    
    return <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <LanguageProvider>  
                    <AuthProvider>
                        <AppRoutes />
                        <ScrollToTop />
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
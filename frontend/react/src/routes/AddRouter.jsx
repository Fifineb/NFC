// src/routes/AddRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';  

// Import des pages
import Dashboard from '../Pages/private/Dashboard';
import Regions from '../Pages/private/Regions';

import Suppliers from '../Pages/private/Suppliers';
import Rapport from '../Pages/private/Rapport';
import Settings from '../Pages/private/Settings';
import Profile from '../Pages/private/Profile';
import StockDetail from '../Pages/private/StockDetail';
import ListeStock from '../Pages/private/Listestock';
import Produits from '../Pages/private/Produits';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes avec ProtectedRoute */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Routes dashboard par rôle */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/manager/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/stocker/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/supervisor/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            <Route path="/regions" element={<ProtectedRoute><Regions /></ProtectedRoute>} />  
            <Route path="/listestock" element={<ProtectedRoute><Listestock /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
            <Route path="/produits" element={<ProtectedRoute><Produits /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/rapports" element={<ProtectedRoute><Rapport /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        </Routes>
    );
};

export default AppRoutes;
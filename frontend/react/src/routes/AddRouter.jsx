// src/routes/AddRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProctectedRoute';
import Stock from '../Pages/private/Stock';

// Import des pages
import Dashboard from '../Pages/private/Dashboard';
import Regions from '../Pages/private/Regions';  // ← Ajoutez cette ligne
import Entery from '../Pages/private/Entery';
import Exits from '../Pages/private/Exits';
import Suppliers from '../Pages/private/Suppliers';
import Rapport from '../Pages/private/Rapport';
import Settings from '../Pages/private/Settings';
import Profile from '../Pages/private/Profile';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/regions" element={<ProtectedRoute><Regions /></ProtectedRoute>} />  {/* ← Ajoutez cette ligne */}
            <Route path="/listestock" element={<ProtectedRoute><ListeStock /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
            <Route path="/entery" element={<ProtectedRoute><Entery /></ProtectedRoute>} />
            <Route path="/exits" element={<ProtectedRoute><Exits /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/rapports" element={<ProtectedRoute><Rapport /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;

// src/routes/AddRouter.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProctectedRoute';

// Import des pages
import Dashboard from '../Pages/private/Dashboard';
import Regions from '../Pages/private/Regions';  // ← Ajoutez cette ligne
import Stock from '../Pages/private/Stock';
import Entery from '../Pages/private/Entery';
import Exits from '../Pages/private/Exits';
import Suppliers from '../Pages/private/Suppliers';
import Raports from '../Pages/private/Raports';
import Settings from '../Pages/private/Settings';
import Adminonly from '../Pages/private/Adminonly';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/regions" element={<ProtectedRoute><Regions /></ProtectedRoute>} />  {/* ← Ajoutez cette ligne */}
            <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
            <Route path="/entery" element={<ProtectedRoute><Entery /></ProtectedRoute>} />
            <Route path="/exits" element={<ProtectedRoute><Exits /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/raports" element={<ProtectedRoute><Raports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Adminonly /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;

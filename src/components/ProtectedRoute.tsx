import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRole?: 'STUDENT' | 'EXPERT' | 'ADMIN';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute - user:', user, 'loading:', loading);

    if (loading) return null; // Wait for the token check to finish

    if (!user) return <Navigate to="/login" />;

    if (allowedRole && user.role !== allowedRole) {
        // If user is logged in but doesn't have the required role, redirect to login
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
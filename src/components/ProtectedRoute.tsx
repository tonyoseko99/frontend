import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    console.log('ProtectedRoute - user:', user, 'loading:', loading);

    if (loading) return null; // Wait for the token check to finish

    // Paradigm: Client-Side Guard
    // If no user is logged in, kick them back to login
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
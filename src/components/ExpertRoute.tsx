import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ExpertRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  // Only allow users with role === 'EXPERT'
  return user && user.role === 'EXPERT' ? <Outlet /> : <Navigate to="/login" />;
};

export default ExpertRoute;


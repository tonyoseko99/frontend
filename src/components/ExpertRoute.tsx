import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ExpertRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Only allow users with role === 'EXPERT'
  return user && user.role === 'EXPERT' ? <Outlet /> : <Navigate to="/login" />;
};

export default ExpertRoute;


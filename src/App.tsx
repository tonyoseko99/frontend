import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import {Login} from './pages/Login';
import DashboardHome from './pages/student/DashboardHome';
import OrdersList from './pages/student/OrdersList';
import CreateOrder from './pages/student/CreateOrder';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Student Routes */}
                    {/* Paradigm: We wrap the Layout in a ProtectedRoute to gatekeep the entire /dashboard path */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Layout />}>
                            <Route index element={<DashboardHome />} />
                            <Route path="orders" element={<OrdersList />} />
                            <Route path="create-order" element={<CreateOrder />} />
                        </Route>
                    </Route>

                    {/* Fallback Catch-all */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
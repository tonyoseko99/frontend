import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ExpertRoute from './components/ExpertRoute';
import Layout from './components/Layout';

// Pages
import {Login} from './pages/Login';
import DashboardHome from './pages/student/DashboardHome';
import OrdersList from './pages/student/OrdersList';
import CreateOrder from './pages/student/CreateOrder';
import OrderDetails from './pages/student/OrderDetails';
import LandingPage from "./pages/LandingPage";
import Register from './pages/Register';

// Expert pages
import JobsList from './pages/expert/JobsList';
import SubmitSolution from './pages/expert/SubmitSolution';
import ExpertOnboarding from './pages/expert/ExpertOnboarding';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Student Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Layout />}>
                            <Route index element={<DashboardHome />} />
                            <Route path="orders" element={<OrdersList />} />
                            <Route path="orders/:id" element={<OrderDetails />} />
                            <Route path="create-order" element={<CreateOrder />} />
                        </Route>
                    </Route>

                    {/* Expert Routes */}
                    <Route element={<ExpertRoute />}>
                        <Route path="/expert" element={<Layout />}>
                            <Route index element={<JobsList />} />
                            <Route path="jobs" element={<JobsList />} />
                            <Route path="jobs/:id/submit" element={<SubmitSolution />} />
                            <Route path="onboard" element={<ExpertOnboarding />} />
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
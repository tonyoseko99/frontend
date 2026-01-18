import { APP_CONFIG } from './utils/domainConfig';
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { Login } from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardHome from "./pages/student/DashboardHome";
import OrdersList from "./pages/student/OrdersList";
import CreateOrder from "./pages/student/CreateOrder";
import OrderDetails from "./pages/student/OrderDetails";
import StudentLayout from "./pages/student/StudentLayout";
import StudentMessages from "./pages/student/StudentMessages";
import StudentProfile from "./pages/student/StudentProfile";
import TutorLayout from "./pages/expert/TutorLayout";
import TutorDashboard from "./pages/expert/TutorDashboard";
import AvailableJobs from "./pages/expert/AvailableJobs";
import JobDetails from "./pages/expert/JobDetails";
import SubmitSolution from "./pages/expert/SubmitSolution";
import SubmissionsList from "./pages/expert/SubmissionsList";
import ExpertOnboarding from "./pages/expert/ExpertOnboarding";
import ExpertProfilePage from "./pages/expert/ExpertProfilePage";
import ExpertMessages from "./pages/expert/ExpertMessages";

import MyJobs from "./pages/expert/MyJobs";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import UserManagement from "./pages/admin/UserManagement";
import OrderManagement from "./pages/admin/OrderManagement";

import { SocketProvider } from './context/SocketContext';

import ExpertProfile from './pages/expert/ExpertProfile';

import Proctoring from './pages/Proctoring';

function App() {
    const isTutorPortal = APP_CONFIG?.type === 'EXPERT';
    const isAdminPortal = APP_CONFIG?.type === 'ADMIN';

    return (
        <SocketProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/expert/:expertId" element={<ExpertProfile />} />
                        <Route path="/proctoring" element={<Proctoring />} />

                        {isAdminPortal ? (
                            /* ADMIN DOMAIN ROUTES */
                            <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
                                <Route path="/" element={<Navigate to="/admin" replace />} />
                                <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="users" element={<UserManagement />} />
                                    <Route path="orders" element={<OrderManagement />} />
                                </Route>
                            </Route>
                        ) : isTutorPortal ? (
                            /* TUTOR DOMAIN ROUTES */
                            <Route element={<ProtectedRoute allowedRole="EXPERT" />}>
                                <Route path="/" element={<Navigate to="/expert" replace />} />
                                <Route path="/dashboard" element={<Navigate to="/expert" replace />} />
                                <Route path="/expert" element={<TutorLayout />}>
                                    <Route index element={<TutorDashboard />} />
                                    <Route path="jobs" element={<AvailableJobs />} />
                                    <Route path="jobs/:jobId" element={<JobDetails />} />
                                    <Route path="my-jobs" element={<MyJobs />} />
                                    <Route path="my-jobs/:jobId" element={<JobDetails />} />
                                    <Route path="submissions" element={<SubmissionsList />} />
                                    <Route path="submissions/:jobId" element={<SubmitSolution />} />
                                    <Route path="profile" element={<ExpertProfilePage />} />
                                    <Route path="messages" element={<ExpertMessages />} />
                                    <Route path="onboarding" element={<ExpertOnboarding />} />
                                </Route>
                            </Route>
                        ) : (
                            /* STUDENT DOMAIN ROUTES */
                            <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
                                <Route path="/dashboard" element={<StudentLayout />}>
                                    <Route index element={<DashboardHome />} />
                                    <Route path="orders" element={<OrdersList />} />
                                    <Route path="create-order" element={<CreateOrder />} />
                                    <Route path="orders/:orderId" element={<OrderDetails />} />
                                    <Route path="messages" element={<StudentMessages />} />
                                    <Route path="profile" element={<StudentProfile />} />
                                </Route>
                            </Route>
                        )}
                    </Routes>
                </Router>
            </AuthProvider>
        </SocketProvider>
    );
}



export default App;


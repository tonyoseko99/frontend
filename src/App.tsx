import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {Login} from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        // The AuthProvider wraps the app so every page knows if a user is logged in
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Paradigm: Routing - This maps the URL path to the Login component */}
                    <Route path="/login" element={<Login />} />

                    {/* Default redirect: If a user hits the root '/', send them to login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* We will add Dashboard routes here later */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
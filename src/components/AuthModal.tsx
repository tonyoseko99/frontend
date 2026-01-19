import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, ArrowRight, Shield, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../utils/domainConfig';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');

    // Register State
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState<'STUDENT' | 'EXPERT'>('STUDENT');
    const [regDomain, setRegDomain] = useState('');

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload: any = {
                email: loginEmail,
                password: loginPassword,
                expectedRole: APP_CONFIG.type
            };

            if (requires2FA) {
                payload.twoFactorCode = twoFactorCode;
            }

            const response = await apiClient.post('/auth/login', payload);

            if (response.data.requires2FA) {
                setRequires2FA(true);
                setLoading(false);
                return;
            }

            const { token, role } = response.data;
            login(token);

            if (role === 'EXPERT') {
                navigate('/expert/dashboard');
            } else if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.error || err?.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (regRole === 'EXPERT' && regDomain && !regDomain.includes('.')) {
            setError('Please provide a valid domain (e.g. university.edu)');
            return;
        }

        setLoading(true);
        try {
            if (regRole === 'EXPERT') {
                await apiClient.post('/auth/register/expert', {
                    email: regEmail,
                    password: regPassword,
                    domain: regDomain || undefined
                });
            } else {
                await apiClient.post('/auth/register', {
                    email: regEmail,
                    password: regPassword,
                    role: 'STUDENT'
                });
            }

            // Auto login
            const res = await apiClient.post('/auth/login', { email: regEmail, password: regPassword });
            const { token, role: userRole } = res.data;
            login(token);

            if (userRole === 'EXPERT') {
                navigate('/expert/onboard');
            } else {
                navigate('/dashboard');
            }
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">
                            {requires2FA ? 'Two-Factor Auth' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {requires2FA
                                ? 'Verify your identity to continue'
                                : mode === 'login'
                                    ? 'Enter your credentials to access your portal'
                                    : 'Join ProAcademic and excel in your studies'}
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {requires2FA ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">6-Digit Code</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition text-center text-2xl font-mono tracking-[0.5em]"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || twoFactorCode.length !== 6}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                Verify & Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setRequires2FA(false)}
                                className="w-full text-sm font-bold text-slate-400 hover:text-blue-600 transition"
                            >
                                Back to login
                            </button>
                        </form>
                    ) : mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-medium"
                                        placeholder="name@example.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-medium"
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                                Sign In
                            </button>
                            <div className="text-center pt-2">
                                <p className="text-slate-500 text-sm">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('register')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Register here
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => setRegRole('STUDENT')}
                                    className={`py-2.5 rounded-xl text-xs font-black transition-all ${regRole === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    STUDENT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRegRole('EXPERT')}
                                    className={`py-2.5 rounded-xl text-xs font-black transition-all ${regRole === 'EXPERT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    EXPERT
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-medium"
                                        placeholder="name@example.com"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-medium"
                                        placeholder="••••••••"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {regRole === 'EXPERT' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Academic Domain</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-medium"
                                            placeholder="university.edu (optional)"
                                            value={regDomain}
                                            onChange={(e) => setRegDomain(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 px-1 font-medium">Verify your expert status with a .edu domain if available.</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                Create Account
                            </button>
                            <div className="text-center pt-2">
                                <p className="text-slate-500 text-sm">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('login')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Log in here
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;

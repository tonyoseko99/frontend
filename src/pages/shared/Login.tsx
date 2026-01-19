import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import apiClient from '../../api/client.ts';
import { APP_CONFIG } from "../../utils/domainConfig.ts";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const appRole = APP_CONFIG.type; // 'STUDENT' or 'EXPERT'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting login...');
      const payload: any = {
        email,
        password,
        expectedRole: appRole
      };

      if (requires2FA) {
        payload.twoFactorCode = twoFactorCode;
      }

      const response = await apiClient.post('/auth/login', payload);
      console.log('Login response:', response.data);

      if (response.data.requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      const { token, role } = response.data;
      login(token);

      console.log('Token stored, navigating to dashboard...');
      // Navigate based on actual user role
      if (role === 'EXPERT') {
        navigate('/expert');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sign In</h2>
        <div className="space-y-4">
          {!requires2FA ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="2faCode" className="block text-sm font-medium text-slate-600">Two-Factor Authentication Code</label>
              <input
                id="2faCode"
                type="text"
                className="w-full mt-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono tracking-widest"
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                autoFocus
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (requires2FA ? 'Verifying...' : 'Signing in...') : (requires2FA ? 'Verify & Sign In' : 'Sign In')}
          </button>

          <div className="text-center mt-2">
            {!requires2FA ? (
              <a href="/register" className="text-sm text-blue-600 hover:underline">Create an account</a>
            ) : (
              <button
                type="button"
                onClick={() => setRequires2FA(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to credentials
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

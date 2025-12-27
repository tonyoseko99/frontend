import React, { useState, useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/client';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login...');
      const response = await apiClient.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      login(response.data.token);
      console.log('Token stored, navigating to dashboard...');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      alert("Login failed. Check credentials.");
    }
  };

  const loginAsExpert = () => {
    // Dev helper: create a fake token and mark as EXPERT
    login('dev-expert-token', 'EXPERT');
    navigate('/expert');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Sign In</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
            <input
              id="email"
              type="email"
              className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition">
            Sign In
          </button>

          {/* Dev helper to sign in as expert quickly */}
          <button type="button" onClick={loginAsExpert} className="w-full mt-2 bg-slate-200 text-slate-800 py-2 rounded-md">
            Sign in as Expert (dev)
          </button>

          <div className="text-center mt-2">
            <a href="/register" className="text-sm text-blue-600 hover:underline">Create an account</a>
          </div>
         </div>
       </form>
     </div>
   );
 };

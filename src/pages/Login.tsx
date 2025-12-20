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
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Student Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Email Address</label>
            <input 
              type="email" 
              className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input 
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
        </div>
      </form>
    </div>
  );
};
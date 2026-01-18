import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client.ts';
import { useAuth } from '../../context/AuthContext.tsx';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'EXPERT'>('STUDENT');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateDomain = (d: string) => {
    if (!d) return true;
    // very small sanity check: no spaces and contains a dot
    return !/\s/.test(d) && d.includes('.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'EXPERT' && !validateDomain(domain)) {
      setError('Please provide a valid domain for expert registration (e.g. university.edu)');
      return;
    }

    setLoading(true);

    try {
      if (role === 'EXPERT') {
        // call dedicated expert register endpoint
        await apiClient.post('/auth/register/expert', { email, password, domain: domain || undefined });
      } else {
        await apiClient.post('/auth/register', { email, password, role });
      }

      // Login to obtain token
      const res = await apiClient.post('/auth/login', { email, password });
      const { token, role: userRole } = res.data;
      login(token);

      // Redirect based on actual user role from token
      if (userRole === 'EXPERT') {
        navigate('/expert/onboard');
      } else if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else if (typeof err === 'object' && err !== null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err?.response?.data?.message;
        setError(typeof msg === 'string' ? msg : 'Registration failed');
      } else setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Create an account</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
            <input id="email" type="email" className="w-full mt-1 p-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
            <input id="password" type="password" className="w-full mt-1 p-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <fieldset className="mt-2">
            <legend className="block text-sm font-medium text-slate-600">I am a</legend>
            <div className="flex gap-4 mt-2">
              <div>
                <input id="role-student" type="radio" name="role" value="STUDENT" checked={role === 'STUDENT'} onChange={() => setRole('STUDENT')} />
                <label htmlFor="role-student" className="ml-2">Student</label>
              </div>
              <div>
                <input id="role-expert" type="radio" name="role" value="EXPERT" checked={role === 'EXPERT'} onChange={() => setRole('EXPERT')} />
                <label htmlFor="role-expert" className="ml-2">Expert (Tutor)</label>
              </div>
            </div>
          </fieldset>

          {role === 'EXPERT' && (
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-slate-600">Allowed email domain (optional)</label>
              <input id="domain" type="text" className="w-full mt-1 p-2 border rounded-md" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="university.edu" />
              <p className="text-xs text-slate-400 mt-1">If set, only emails from this domain can register as experts.</p>
            </div>
          )}

          {error && <div className="text-red-500">{error}</div>}

          <button className="w-full bg-blue-600 text-white py-2 rounded-md font-bold">{loading ? 'Creating...' : 'Create account'}</button>
        </div>
      </form>
    </div>
  );
};

export default Register;


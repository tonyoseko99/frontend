import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

const ExpertOnboarding = () => {
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('bio', bio);
      fd.append('subjects', subjects);
      fd.append('hourlyRate', hourlyRate);
      if (files) {
        Array.from(files).forEach((f) => fd.append('qualifications', f));
      }

      await apiClient.post('/expert/onboard', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // On success, redirect to expert dashboard
      navigate('/expert');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else if (typeof err === 'object' && err !== null) {
        // @ts-expect-error may be axios-like
        const msg = err?.response?.data?.message;
        setError(typeof msg === 'string' ? msg : 'Onboarding failed');
      } else setError('Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Expert Onboarding</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium">Short bio</label>
          <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={4} />
        </div>

        <div>
          <label htmlFor="subjects" className="block text-sm font-medium">Subjects (comma-separated)</label>
          <input id="subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium">Hourly rate (USD)</label>
          <input id="hourlyRate" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full mt-1 p-2 border rounded" type="number" step="0.01" />
        </div>

        <div>
          <label htmlFor="qualifications" className="block text-sm font-medium">Qualifications (PDFs/photos)</label>
          <input id="qualifications" type="file" multiple onChange={(e) => setFiles(e.target.files)} className="mt-1" />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
      </form>
    </div>
  );
};

export default ExpertOnboarding;


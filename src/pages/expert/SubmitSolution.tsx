import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/client';

const SubmitSolution = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return setError('Missing order id');
    if (!files || files.length === 0) return setError('Please attach solution files');

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('solutionFiles', f));

    try {
      setLoading(true);
      await apiClient.post(`/expert/jobs/${id}/submit`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/dashboard');
    } catch (err) {
      let message = 'Submission failed';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'object' && err !== null) {
        try {
          message = JSON.stringify(err);
        } catch (error_) {
          console.warn('Failed to stringify error object in SubmitSolution:', error_);
          message = 'Submission failed';
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Submit Solution</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="solutionFiles" className="block text-sm font-medium text-slate-700">Attach solution files</label>
          <input id="solutionFiles" type="file" multiple onChange={(e) => setFiles(e.target.files)} className="mt-2" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default SubmitSolution;

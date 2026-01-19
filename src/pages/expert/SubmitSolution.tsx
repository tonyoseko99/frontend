import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../api/client';
import { Upload, ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

const SubmitSolution = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return setError('Missing job ID');
    if (!files || files.length === 0) return setError('Please attach solution files');
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    if (!files) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('solutionFiles', f));

    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`/expert/jobs/${jobId}/submit`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Solution submitted successfully!');
      navigate('/expert/my-jobs');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Submission failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center gap-3">
            <Upload className="text-green-600" size={32} />
            <h2 className="text-3xl font-bold text-slate-800">Submit Solution</h2>
          </div>
          <p className="text-slate-600 mt-2">Upload your completed work for review</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label
              htmlFor="solutionFiles"
              className="block text-sm font-medium text-slate-700 mb-3"
            >
              <FileText className="inline mr-2" size={16} />
              Attach Solution Files
            </label>
            <input
              id="solutionFiles"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            />
            <p className="text-sm text-slate-500 mt-2">
              Accepted formats: PDF, DOC, DOCX, TXT, ZIP, RAR
            </p>
            {files && files.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  {files.length} file(s) selected
                </p>
                <ul className="text-sm text-green-600 mt-1">
                  {Array.from(files).map((file, idx) => (
                    <li key={idx}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !files || files.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Upload size={20} />
                Submit Solution
              </>
            )}
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmit}
        title="Submit Solution?"
        message="Are you sure you are ready to submit this solution? Please double-check that all files are correct and complete."
        confirmLabel="Yes, Submit Now"
        type="info"
      />
    </div>
  );
};

export default SubmitSolution;

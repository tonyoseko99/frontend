import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/client';
import { Clock, DollarSign, FileText, ArrowLeft, Loader, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

interface Job {
  id: number;
  subject: string;
  description: string;
  deadline: string;
  price: number;
  status?: string;
  files: { url: string; name: string }[];
  revisionNotes?: string;
}

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const navigate = useNavigate();

  // Determine if this is a claimed job (from my-jobs) or available job
  const isClaimedJob = location.pathname.includes('/my-jobs/');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await apiClient.get(`/expert/jobs/${jobId}`);
        setJob(res.data);
      } catch (err) {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, isClaimedJob]);

  // Countdown timer for claimed jobs
  useEffect(() => {
    if (!job || !isClaimedJob) return;

    const updateTimer = () => {
      const deadline = new Date(job.deadline).getTime();
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeRemaining('EXPIRED');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [job, isClaimedJob]);

  const handleClaimJob = async () => {
    setShowClaimConfirm(true);
  };

  const confirmClaimJob = async () => {
    setClaiming(true);
    try {
      await apiClient.post(`/expert/jobs/${jobId}/claim`);
      alert('Job claimed successfully! Redirecting to My Jobs...');
      navigate('/expert/my-jobs');
    } catch (err) {
      setError('Failed to claim job. It may have been claimed by another expert.');
    } finally {
      setClaiming(false);
    }
  };

  const handleSubmitSolution = () => {
    navigate(`/expert/submissions/${jobId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-blue-600" size={48} /></div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
        <AlertTriangle size={32} />
        <div>
          <h3 className="font-bold text-lg">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const getStatusBadge = () => {
    if (!job.status) return null;

    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      'IN_PROGRESS': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock size={16} /> },
      'REVIEW': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={16} /> },
      'COMPLETED': { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={16} /> },
    };

    const config = statusConfig[job.status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };

    return (
      <span className={`${config.bg} ${config.text} px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 w-fit`}>
        {config.icon}
        {job.status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-slate-800">{job.subject}</h2>
            {getStatusBadge()}
          </div>

          <div className="flex items-center gap-8 text-slate-500 mt-3">
            <span className="flex items-center gap-2"><Clock size={16} /> Deadline: {new Date(job.deadline).toLocaleString()}</span>
            <span className="flex items-center gap-2 font-bold text-green-600 text-lg"><DollarSign size={20} /> ${job.price.toFixed(2)}</span>
          </div>

          {/* Countdown Timer for Claimed Jobs */}
          {isClaimedJob && timeRemaining && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-600" size={20} />
                <span className="font-bold text-blue-900">Time Remaining:</span>
                <span className={`text-2xl font-mono font-bold ${timeRemaining === 'EXPIRED' ? 'text-red-600' : 'text-blue-600'}`}>
                  {timeRemaining}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-700 mb-2">Instructions</h3>
          <p className="text-slate-600 whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Revision Notes for Experts */}
        {isClaimedJob && job.status === 'IN_PROGRESS' && job.revisionNotes && (
          <div className="mx-8 mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl animate-in slide-in-from-top duration-300">
            <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={20} />
              Revision Feedback from Student
            </h3>
            <div className="bg-white p-4 rounded-xl border border-red-100 text-red-900 shadow-sm italic">
              "{job.revisionNotes}"
            </div>
            <p className="text-xs text-red-600 mt-2">
              Please address the comments above and resubmit your solution.
            </p>
          </div>
        )}

        {job.files && job.files.length > 0 && (
          <div className="p-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-3">Attached Files</h3>
            <ul className="space-y-2">
              {job.files.map((file, index) => (
                <li key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <FileText size={18} /> {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-8 bg-slate-50 border-t border-slate-200">
          {isClaimedJob ? (
            <div className="space-y-3">
              {job.status === 'IN_PROGRESS' && (
                <button
                  onClick={handleSubmitSolution}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  Submit Solution
                </button>
              )}
              {job.status === 'REVIEW' && (
                <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-yellow-700 font-semibold">Solution submitted and under review</p>
                </div>
              )}
              {job.status === 'COMPLETED' && (
                <div className="text-center py-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Job Completed
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleClaimJob}
              disabled={claiming}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {claiming ? 'Claiming...' : 'Claim This Job'}
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showClaimConfirm}
        onClose={() => setShowClaimConfirm(false)}
        onConfirm={confirmClaimJob}
        title="Claim This Job?"
        message="By claiming this job, you commit to delivering high-quality work by the specified deadline. This action cannot be undone once another expert is excluded."
        confirmLabel="Yes, Claim Job"
        type="warning"
      />
    </div>
  );
};

export default JobDetails;

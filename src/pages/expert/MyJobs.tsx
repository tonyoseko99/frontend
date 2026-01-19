import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { Briefcase, Clock, DollarSign, ArrowRight, Loader, AlertTriangle } from 'lucide-react';

interface Job {
  id: number;
  subject: string;
  deadline: string;
  price: number;
  status: string;
}

const MyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // This endpoint needs to be created on the backend
        const res = await apiClient.get('/expert/my-jobs');
        // Handle both paginated and legacy array responses
        const jobsData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setJobs(jobsData);
      } catch (err) {
        setError('Failed to load your jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleViewJob = (id: number) => {
    navigate(`/expert/my-jobs/${id}`);
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">My Jobs</h1>

      {jobs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Briefcase size={50} className="mx-auto text-slate-400" />
          <h3 className="mt-4 text-xl font-bold text-slate-700">You have no active jobs.</h3>
          <p className="text-slate-500 mt-2">Claim a job from the marketplace to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{job.subject}</h3>
                  <div className="flex items-center gap-6 text-slate-500 text-sm mt-2">
                    <span className="flex items-center gap-2"><Clock size={16} /> {new Date(job.deadline).toLocaleString()}</span>
                    <span className="flex items-center gap-2 font-bold text-green-600"><DollarSign size={16} /> {job.price.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold`}>{job.status}</span>
                  </div>
                </div>
                <button onClick={() => handleViewJob(job.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold">
                  View Details <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;

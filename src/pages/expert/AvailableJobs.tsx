import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { Briefcase, Clock, DollarSign, ArrowRight, AlertTriangle, Loader } from 'lucide-react';

interface Job {
  id: number;
  subject: string;
  deadline: string;
  price: number;
}

const AvailableJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get('/expert/jobs');
        setJobs(res.data);
      } catch (err) {
        setError('Failed to load available jobs. The server might be busy or down. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleViewJob = (id: number) => {
    navigate(`/expert/jobs/${id}`);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-blue-600" size={48} />
        </div>
    );
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
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Job Marketplace</h1>
                <p className="text-slate-500 mt-1">Browse and select academic tasks that match your expertise.</p>
            </div>
        </div>

      {jobs.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Briefcase size={50} className="mx-auto text-slate-400" />
          <h3 className="mt-4 text-xl font-bold text-slate-700">No Jobs Available</h3>
          <p className="text-slate-500 mt-2">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-grow mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-slate-800 hover:text-blue-600 transition">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewJob(job.id); }}>
                      {job.subject}
                    </a>
                  </h3>
                  <div className="flex items-center gap-6 text-slate-500 text-sm mt-2">
                      <span className="flex items-center gap-2"><Clock size={16} /> {new Date(job.deadline).toLocaleString()}</span>
                      <span className="flex items-center gap-2 font-bold text-green-600"><DollarSign size={16} /> {job.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                    <button onClick={() => handleViewJob(job.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-200 transition-all">
                        View & Claim <ArrowRight size={18} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableJobs;
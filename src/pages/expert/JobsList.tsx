import { useEffect, useState } from 'react';
import apiClient from '../../api/client';

interface Job {
  id: number;
  subject: string;
  deadline: string;
  price: number;
}

const JobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await apiClient.get('/expert/jobs');
        setJobs(res.data);
      } catch (err) {
        let message = 'Failed to load jobs';
        if (err instanceof Error) message = err.message;
        else if (typeof err === 'object' && err !== null) {
          // Try to stringify the object; if that fails fallback to a generic message
          try {
            message = JSON.stringify(err);
          } catch (error_) {
            console.warn('Failed to stringify error object in JobsList.fetchJobs:', error_);
            message = 'Failed to load jobs';
          }
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const claim = async (id: number) => {
    try {
      await apiClient.post(`/expert/jobs/${id}/claim`);
      // Optimistically remove the job from the list
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      let message = 'Failed to claim job';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'object' && err !== null) {
        try {
          message = JSON.stringify(err);
        } catch (error_) {
          console.warn('Failed to stringify error object in JobsList.claim:', error_);
          message = 'Failed to claim job';
        }
      }
      setError(message);
    }
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>
      {jobs.length === 0 ? (
        <div>No jobs available right now. Check back later.</div>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{job.subject}</h3>
                  <p className="text-sm text-slate-500">Deadline: {new Date(job.deadline).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">${job.price}</span>
                  <button onClick={() => claim(job.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Claim</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobsList;

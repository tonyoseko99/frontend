import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { MessageSquare, Loader, AlertTriangle } from 'lucide-react';
import Chat from '../../components/Chat';

interface Job {
    id: number;
    subject: string;
    status: string;
    price: number;
    deadline: string;
}

const ExpertMessages = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await apiClient.get('/expert/my-jobs');
                const jobsData = Array.isArray(res.data) ? res.data : res.data.data;
                setJobs(jobsData);
            } catch (err) {
                setError('Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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
        <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Jobs List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-800">Active Jobs</h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {jobs.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare size={40} className="mx-auto text-slate-400 mb-2" />
                                <p className="text-slate-500">No active jobs</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${selectedJob?.id === job.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                        }`}
                                >
                                    <h3 className="font-semibold text-slate-800 truncate">{job.subject}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="px-2 py-1 bg-slate-100 rounded">{job.status}</span>
                                        <span>${job.price}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="md:col-span-2 overflow-hidden flex flex-col">
                    {selectedJob ? (
                        <Chat orderId={selectedJob.id.toString()} isLocked={selectedJob.status === 'COMPLETED'} />
                    ) : (
                        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare size={60} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700">Select a job to start messaging</h3>
                                <p className="text-slate-500 mt-2">Choose a job from the list to view and send messages</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpertMessages;

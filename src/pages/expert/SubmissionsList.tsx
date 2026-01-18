import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { FileText, Clock, DollarSign, CheckCircle, Loader, AlertTriangle } from 'lucide-react';

interface Submission {
    id: number;
    subject: string;
    deadline: string;
    price: number;
    status: string;
    submittedAt?: string;
}

const SubmissionsList = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                // Fetch jobs that have been submitted (status: REVIEW or COMPLETED)
                const res = await apiClient.get('/expert/my-jobs');
                const submittedJobs = res.data.filter((job: Submission) =>
                    job.status === 'REVIEW' || job.status === 'COMPLETED'
                );
                setSubmissions(submittedJobs);
            } catch (err) {
                setError('Failed to load submissions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
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
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">My Submissions</h1>

            {submissions.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <FileText size={50} className="mx-auto text-slate-400" />
                    <h3 className="mt-4 text-xl font-bold text-slate-700">No submissions yet.</h3>
                    <p className="text-slate-500 mt-2">Complete and submit jobs to see them here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-800">{submission.subject}</h3>
                                    <div className="flex items-center gap-6 text-slate-500 text-sm mt-2">
                                        <span className="flex items-center gap-2"><Clock size={16} /> {new Date(submission.deadline).toLocaleString()}</span>
                                        <span className="flex items-center gap-2 font-bold text-green-600"><DollarSign size={16} /> {submission.price.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${submission.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {submission.status === 'COMPLETED' ? (
                                            <span className="flex items-center gap-2"><CheckCircle size={16} /> Completed</span>
                                        ) : (
                                            <span className="flex items-center gap-2"><Clock size={16} /> Under Review</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionsList;

import { useEffect, useState } from 'react';
import { DollarSign, BookOpen, CheckCircle, Clock, Loader, TrendingUp, Award, Target, Briefcase, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

interface DashboardStats {
    totalEarnings: number;
    activeJobs: number;
    completedJobs: number;
    lateSubmissions: number;
}

interface RecentJob {
    id: number;
    subject: string;
    status: string;
    deadline: string;
    price: number;
}

const TutorDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        totalEarnings: 0,
        activeJobs: 0,
        completedJobs: 0,
        lateSubmissions: 0
    });
    const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, jobsRes] = await Promise.all([
                    apiClient.get('/expert/dashboard/stats'),
                    apiClient.get('/expert/my-jobs')
                ]);
                setStats(statsRes.data);
                setRecentJobs(jobsRes.data.slice(0, 5)); // Get latest 5 jobs
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    const completionRate = stats.completedJobs > 0
        ? ((stats.completedJobs / (stats.completedJobs + stats.activeJobs)) * 100).toFixed(0)
        : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome Back, Expert! 👋</h1>
                <p className="text-indigo-100">Here's your performance overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-sm border border-indigo-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <DollarSign className="text-indigo-600" size={32} />
                        <TrendingUp className="text-indigo-400" size={20} />
                    </div>
                    <p className="text-sm text-indigo-700 font-medium">Total Earnings</p>
                    <p className="text-3xl font-bold text-indigo-900">${stats.totalEarnings.toFixed(2)}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <BookOpen className="text-blue-600" size={32} />
                        <Briefcase className="text-blue-400" size={20} />
                    </div>
                    <p className="text-sm text-blue-700 font-medium">Active Jobs</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.activeJobs}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <CheckCircle className="text-emerald-600" size={32} />
                        <Award className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-sm text-emerald-700 font-medium">Completed</p>
                    <p className="text-3xl font-bold text-emerald-900">{stats.completedJobs}</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-sm border border-orange-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <Clock className="text-orange-600" size={32} />
                        <Target className="text-orange-400" size={20} />
                    </div>
                    <p className="text-sm text-orange-700 font-medium">Completion Rate</p>
                    <p className="text-3xl font-bold text-orange-900">{completionRate}%</p>
                </div>
            </div>

            {/* Recent Jobs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Jobs List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900 text-lg">Recent Jobs</h2>
                    </div>
                    <div className="p-6">
                        {recentJobs.length > 0 ? (
                            <div className="space-y-3">
                                {recentJobs.map(job => (
                                    <div
                                        key={job.id}
                                        onClick={() => navigate(`/expert/jobs/${job.id}`)}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition border border-slate-200"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{job.subject}</h3>
                                            <p className="text-sm text-slate-500">
                                                Due: {new Date(job.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(job.status)}`}>
                                                {job.status}
                                            </span>
                                            <span className="font-bold text-indigo-600">${job.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No jobs yet</p>
                                <button
                                    onClick={() => navigate('/expert/available-jobs')}
                                    className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                                >
                                    Browse Available Jobs
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900 text-lg">Quick Actions</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <button
                            onClick={() => navigate('/expert/available-jobs')}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                            <BookOpen size={20} />
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => navigate('/expert/my-jobs')}
                            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                            <Briefcase size={20} />
                            My Jobs
                        </button>
                        <button
                            onClick={() => navigate('/expert/messages')}
                            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                            <Clock size={20} />
                            Messages
                        </button>
                        <button
                            onClick={() => navigate('/expert/reviews')}
                            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                            <Star size={20} className="text-yellow-500" />
                            My Reviews
                        </button>
                        <button
                            onClick={() => navigate('/expert/profile')}
                            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                            <Award size={20} />
                            My Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                <h2 className="font-bold text-purple-900 text-lg mb-4 flex items-center gap-2">
                    <TrendingUp size={24} />
                    Performance Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                        <p className="text-sm text-purple-700 font-medium mb-1">Avg. Completion Time</p>
                        <p className="text-2xl font-bold text-purple-900">2.5 days</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                        <p className="text-sm text-purple-700 font-medium mb-1">Success Rate</p>
                        <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                        <p className="text-sm text-purple-700 font-medium mb-1">Avg. Rating</p>
                        <p className="text-2xl font-bold text-purple-900">4.8 ⭐</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'IN_PROGRESS': return 'bg-indigo-100 text-indigo-700';
        case 'REVIEW': return 'bg-orange-100 text-orange-700';
        case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
        case 'ASSIGNED': return 'bg-blue-100 text-blue-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

export default TutorDashboard;
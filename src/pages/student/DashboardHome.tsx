import { useEffect, useState } from 'react';
import { Clock, CheckCircle, CreditCard, Plus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';

const DashboardHome = () => {
    const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/student/my-orders');
                const orders = res.data;
                setStats({
                    active: orders.filter((o: any) => o.status === 'ASSIGNED').length,
                    completed: orders.filter((o: any) => o.status === 'COMPLETED').length,
                    pending: orders.filter((o: any) => o.status === 'PENDING').length,
                });
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
                    <p className="text-slate-500 mt-1">Track your academic progress and active assignments.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/create-order')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-200 transition-all"
                >
                    <Plus size={20} /> New Task
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Clock className="text-blue-600" />} label="In Progress" value={stats.active} bgColor="bg-blue-50" />
                <StatCard icon={<CheckCircle className="text-emerald-600" />} label="Completed" value={stats.completed} bgColor="bg-emerald-50" />
                <StatCard icon={<CreditCard className="text-amber-600" />} label="Needs Payment" value={stats.pending} bgColor="bg-amber-50" />
            </div>

            {/* Welcome Banner */}
            <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-2xl font-bold mb-3">Ready to ace your next exam?</h2>
                    <p className="text-slate-400 mb-6 text-lg">Post your assignment details and let our verified experts handle the heavy lifting for you.</p>
                    <Link to="/dashboard/create-order" className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition">
                        Create New Order <ArrowRight size={18} />
                    </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Clock size={300} />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, bgColor }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${bgColor}`}>{icon}</div>
            <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </div>
);

export default DashboardHome;
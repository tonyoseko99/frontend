import { useEffect, useState } from 'react';
import { Clock, CheckCircle, CreditCard, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

const DashboardHome = () => {
    const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/student/orders');
                const orders = res.data;

                // Paradigm: Client-side Aggregation
                // We filter the orders array to generate summary stats
                setStats({
                    active: orders.filter((o: any) => o.status === 'ASSIGNED').length,
                    completed: orders.filter((o: any) => o.status === 'COMPLETED').length,
                    pending: orders.filter((o: any) => o.status === 'PENDING').length,
                });
            } catch (err) {
                console.error("Error fetching dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                    <p className="text-slate-500">Here is what is happening with your tasks today.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/create-order')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus size={20} /> New Order
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Clock className="text-blue-600" />} label="In Progress" value={stats.active} color="bg-blue-50" />
                <StatCard icon={<CheckCircle className="text-green-600" />} label="Completed" value={stats.completed} color="bg-green-50" />
                <StatCard icon={<CreditCard className="text-yellow-600" />} label="Unpaid/Pending" value={stats.pending} color="bg-yellow-50" />
            </div>

            <div className="bg-blue-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Need an expert for an exam?</h2>
                    <p className="text-blue-100 mb-4 max-w-md">Our tutors are available 24/7 to help you with complex assignments and live exams.</p>
                    <button onClick={() => navigate('/dashboard/create-order')} className="bg-white text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition">
                        Get Started
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Plus size={120} />
                </div>
            </div>
        </div>
    );
};

// Sub-component for clean code
const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default DashboardHome;
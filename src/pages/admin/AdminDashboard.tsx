import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { Users, BookOpen, DollarSign, AlertTriangle, Loader } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load platform statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600" />} label="Total Users" value={stats?.totalUsers} bgColor="bg-blue-50" />
        <StatCard icon={<BookOpen className="text-emerald-600" />} label="Total Orders" value={stats?.totalOrders} bgColor="bg-emerald-50" />
        <StatCard icon={<DollarSign className="text-amber-600" />} label="Total Revenue" value={`$${stats?.totalRevenue.toFixed(2)}`} bgColor="bg-amber-50" />
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

export default AdminDashboard;

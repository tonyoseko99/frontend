import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    CheckCircle,
    AlertCircle,
    Plus,
    TrendingUp,
    FileText,
    DollarSign,
    Loader,
    ArrowRight
} from 'lucide-react';
import apiClient from '../../api/client';

interface Order {
    id: number;
    subject: string;
    status: string;
    deadline: string;
    price: number;
}

interface DashboardStats {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalSpent: number;
}

const DashboardHome = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiClient.get('/student/orders');
                const ordersData = res.data;
                setOrders(ordersData.slice(0, 5)); // Get latest 5 orders

                // Calculate stats
                const stats = {
                    totalOrders: ordersData.length,
                    activeOrders: ordersData.filter((o: Order) =>
                        ['PAID', 'IN_PROGRESS', 'REVIEW'].includes(o.status)
                    ).length,
                    completedOrders: ordersData.filter((o: Order) => o.status === 'COMPLETED').length,
                    totalSpent: ordersData.reduce((sum: number, o: Order) => sum + o.price, 0)
                };
                setStats(stats);
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
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard! 📚</h1>
                <p className="text-blue-100">Manage your academic tasks and track your progress</p>
                <button
                    onClick={() => navigate('/dashboard/create-order')}
                    className="mt-4 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow-md flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create New Order
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <BookOpen className="text-blue-600" size={32} />
                        <TrendingUp className="text-blue-400" size={20} />
                    </div>
                    <p className="text-sm text-blue-700 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.totalOrders}</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-sm border border-indigo-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <Clock className="text-indigo-600" size={32} />
                        <FileText className="text-indigo-400" size={20} />
                    </div>
                    <p className="text-sm text-indigo-700 font-medium">Active Orders</p>
                    <p className="text-3xl font-bold text-indigo-900">{stats.activeOrders}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <CheckCircle className="text-emerald-600" size={32} />
                        <TrendingUp className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-sm text-emerald-700 font-medium">Completed</p>
                    <p className="text-3xl font-bold text-emerald-900">{stats.completedOrders}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-sm border border-purple-200 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                        <DollarSign className="text-purple-600" size={32} />
                        <TrendingUp className="text-purple-400" size={20} />
                    </div>
                    <p className="text-sm text-purple-700 font-medium">Total Spent</p>
                    <p className="text-3xl font-bold text-purple-900">${stats.totalSpent.toFixed(2)}</p>
                </div>
            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 text-lg">Recent Orders</h2>
                        <button
                            onClick={() => navigate('/dashboard/orders')}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                        >
                            View All
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="p-6">
                        {orders.length > 0 ? (
                            <div className="space-y-3">
                                {orders.map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition border border-slate-200"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{order.subject}</h3>
                                            <p className="text-sm text-slate-500">
                                                Due: {new Date(order.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="font-bold text-blue-600">${order.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                                <p className="font-medium mb-2">No orders yet</p>
                                <p className="text-sm mb-4">Create your first order to get started</p>
                                <button
                                    onClick={() => navigate('/dashboard/create-order')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Create Order
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
                            onClick={() => navigate('/dashboard/create-order')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            New Order
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/orders')}
                            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                            <BookOpen size={20} />
                            All Orders
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/messages')}
                            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                        >
                            <FileText size={20} />
                            Messages
                        </button>
                    </div>

                    {/* Tips Section */}
                    <div className="px-6 pb-6">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                            <h3 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                                <AlertCircle size={16} />
                                Quick Tip
                            </h3>
                            <p className="text-xs text-amber-800">
                                Provide detailed instructions and attach relevant files to help experts deliver better results!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status Overview */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                    <TrendingUp size={24} />
                    Order Status Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {orders.filter(o => o.status === 'PENDING').length}
                        </p>
                        <p className="text-sm text-slate-600">Pending Payment</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl text-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <FileText className="text-indigo-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {orders.filter(o => o.status === 'IN_PROGRESS').length}
                        </p>
                        <p className="text-sm text-slate-600">In Progress</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="text-orange-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {orders.filter(o => o.status === 'REVIEW').length}
                        </p>
                        <p className="text-sm text-slate-600">Awaiting Review</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="text-emerald-600" size={24} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">
                            {orders.filter(o => o.status === 'COMPLETED').length}
                        </p>
                        <p className="text-sm text-slate-600">Completed</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        case 'PAID': return 'bg-green-100 text-green-700';
        case 'IN_PROGRESS': return 'bg-indigo-100 text-indigo-700';
        case 'REVIEW': return 'bg-orange-100 text-orange-700';
        case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

export default DashboardHome;
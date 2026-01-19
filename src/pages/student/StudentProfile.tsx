import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Award, BookOpen, DollarSign, Edit2, Save, X, Shield, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/client';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import TwoFactorSetupModal from '../../components/TwoFactorSetupModal';
import TwoFactorDisableModal from '../../components/TwoFactorDisableModal';

interface UserProfile {
    id: number;
    email: string;
    role: string;
    balance: number;
    createdAt: string;
    twoFactorEnabled?: boolean;
}

interface Order {
    id: number;
    subject: string;
    status: string;
    price: number;
    createdAt: string;
}

interface ProfileStats {
    totalOrders: number;
    completedOrders: number;
    totalSpent: number;
    averageRating: number;
}

const StudentProfile = () => {
    const [profile, setProfile] = useState<UserProfile>({
        id: 0,
        email: '',
        role: 'STUDENT',
        balance: 0,
        createdAt: '',
        twoFactorEnabled: false
    });
    const [stats, setStats] = useState<ProfileStats>({
        totalOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        averageRating: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FASetupModal, setShow2FASetupModal] = useState(false);
    const [show2FADisableModal, setShow2FADisableModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile from auth context or API
                const userRes = await apiClient.get('/auth/me');
                setProfile(userRes.data);

                // Fetch orders to calculate stats
                const ordersRes = await apiClient.get('/student/orders');
                const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data;

                const stats = {
                    totalOrders: orders.length,
                    completedOrders: orders.filter((o: any) => o.status === 'COMPLETED').length,
                    totalSpent: orders.reduce((sum: number, o: any) => sum + o.price, 0),
                    averageRating: orders.filter((o: any) => o.rating).length > 0
                        ? orders.filter((o: any) => o.rating).reduce((sum: number, o: any) => sum + o.rating, 0) / orders.filter((o: any) => o.rating).length
                        : 0
                };
                setStats(stats);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center py-12">Failed to load profile</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                            <User size={48} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{profile.email.split('@')[0]}</h1>
                            <p className="text-blue-100 flex items-center gap-2">
                                <Mail size={16} />
                                {profile.email}
                            </p>
                            <p className="text-blue-100 flex items-center gap-2 mt-1">
                                <Calendar size={16} />
                                Member since {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                    >
                        {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Award className="text-emerald-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Completed</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.completedOrders}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Total Spent</p>
                    <p className="text-3xl font-bold text-slate-900">${stats.totalSpent.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Award className="text-amber-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Rating Given</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.averageRating.toFixed(1)} ⭐</p>
                </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Information */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                        <h2 className="font-bold text-slate-900 text-lg">Account Information</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
                            <input
                                type="text"
                                value="Student Account"
                                disabled
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium opacity-60"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Member Since</label>
                            <input
                                type="text"
                                value={new Date(profile.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                disabled
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium opacity-60"
                            />
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 pt-4">
                                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    <Save size={20} />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    {/* Achievement Badge */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Award className="text-white" size={32} />
                            </div>
                            <h3 className="font-bold text-amber-900 mb-1">Active Student</h3>
                            <p className="text-sm text-amber-700">
                                {stats.totalOrders} orders placed
                            </p>
                        </div>
                    </div>

                    {/* Account Balance */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                            <h3 className="font-bold text-slate-900">Account Balance</h3>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-4xl font-bold text-slate-900">${profile.balance.toFixed(2)}</p>
                            <p className="text-sm text-slate-500 mt-2">Available credits</p>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                            <h3 className="font-bold text-slate-900">Security</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition text-left"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={() => profile.twoFactorEnabled ? setShow2FADisableModal(true) : setShow2FASetupModal(true)}
                                className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition text-left flex items-center justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <Shield size={18} />
                                    Two-Factor Auth
                                </span>
                                {profile.twoFactorEnabled && (
                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                        <CheckCircle2 size={16} />
                                        Enabled
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

            {/* 2FA Setup Modal */}
            <TwoFactorSetupModal
                isOpen={show2FASetupModal}
                onClose={() => setShow2FASetupModal(false)}
                onSuccess={async () => {
                    const userRes = await apiClient.get('/auth/me');
                    setProfile(userRes.data);
                }}
            />

            {/* 2FA Disable Modal */}
            <TwoFactorDisableModal
                isOpen={show2FADisableModal}
                onClose={() => setShow2FADisableModal(false)}
                onSuccess={async () => {
                    const userRes = await apiClient.get('/auth/me');
                    setProfile(userRes.data);
                }}
            />
        </div>
    );
};

export default StudentProfile;

import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import {
    User, BookOpen, DollarSign, Loader, AlertTriangle,
    Save, Camera, Lock, Shield, CheckCircle2,
    Calendar, Mail, Award, TrendingUp, Target, X
} from 'lucide-react';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import TwoFactorSetupModal from '../../components/TwoFactorSetupModal';
import TwoFactorDisableModal from '../../components/TwoFactorDisableModal';

interface ExpertProfile {
    bio: string;
    subjects: string[];
    hourlyRate: number;
    avatarUrl?: string;
    user?: {
        email: string;
        createdAt: string;
        balance: number;
    };
    stats: {
        totalEarnings: number;
        activeJobs: number;
        completedJobs: number;
        lateSubmissions: number;
        averageRating: number;
        successRate: string;
    };
}

const ExpertProfilePage = () => {
    const [profile, setProfile] = useState<ExpertProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [show2FASetupModal, setShow2FASetupModal] = useState(false);
    const [show2FADisableModal, setShow2FADisableModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [bio, setBio] = useState('');
    const [subjects, setSubjects] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get('/expert/profile');
                if (res.data) {
                    setProfile(res.data);
                    setBio(res.data.bio || '');
                    setSubjects(res.data.subjects?.join(', ') || '');
                    setHourlyRate(res.data.hourlyRate?.toString() || '');
                    setAvatarPreview(res.data.avatarUrl || null);
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const formData = new FormData();
            formData.append('bio', bio);
            formData.append('subjects', subjects);
            formData.append('hourlyRate', hourlyRate);

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const res = await apiClient.post('/expert/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccessMessage('Profile updated successfully!');
            if (res.data.profile) {
                setProfile({ ...profile, ...res.data.profile, stats: profile?.stats || res.data.profile.stats });
            }
            setIsEditing(false);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20 shadow-2xl transition group-hover:border-white/40">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} className="text-white/50" />
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{profile?.user?.email.split('@')[0]}</h1>
                            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">EXPERT</span>
                        </div>
                        <div className="space-y-1 text-indigo-100 font-medium">
                            <p className="flex items-center justify-center md:justify-start gap-2">
                                <Mail size={16} /> {profile?.user?.email}
                            </p>
                            <p className="flex items-center justify-center md:justify-start gap-2">
                                <Calendar size={16} /> Member since {new Date(profile?.user?.createdAt || '').toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition flex items-center gap-2"
                    >
                        {isEditing ? <X size={20} /> : <Save size={20} className="hidden" />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><DollarSign size={24} /></div>
                        <span className="text-xs font-black text-indigo-300 uppercase">Earnings</span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold">Total Payouts</p>
                    <p className="text-3xl font-black text-slate-900">${profile?.stats?.totalEarnings.toFixed(2)}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 size={24} /></div>
                        <span className="text-xs font-black text-emerald-300 uppercase">Success</span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold">Success Rate</p>
                    <p className="text-3xl font-black text-slate-900">{profile?.stats?.successRate}%</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Award size={24} /></div>
                        <span className="text-xs font-black text-amber-300 uppercase">Rating</span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold">Avg. Feedback</p>
                    <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-black text-slate-900">{profile?.stats?.averageRating}</p>
                        <span className="text-amber-400">⭐</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><TrendingUp size={24} /></div>
                        <span className="text-xs font-black text-purple-300 uppercase">Activity</span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold">Active Jobs</p>
                    <p className="text-3xl font-black text-slate-900">{profile?.stats?.activeJobs}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-600" />
                                Expert Information
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Subjects of Expertise</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={subjects}
                                        onChange={(e) => setSubjects(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-500 font-medium"
                                        placeholder="e.g., Mathematics, Physics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        disabled={!isEditing}
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-500 font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Professional Bio</label>
                                <textarea
                                    disabled={!isEditing}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-slate-50 disabled:text-slate-500 font-medium resize-none"
                                    placeholder="Describe your background and tutoring style..."
                                />
                            </div>

                            {isEditing && (
                                <div className="flex gap-4 pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}

                            {successMessage && (
                                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 size={20} /> {successMessage}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <AlertTriangle size={20} /> {error}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-6">
                    {/* Security Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <Shield size={20} className="text-indigo-600" />
                                Security Settings
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg group-hover:bg-indigo-50 transition"><Lock size={18} className="text-slate-600 group-hover:text-indigo-600" /></div>
                                    <span className="font-bold text-slate-700">Credentials</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400">Update</span>
                            </button>

                            <button
                                onClick={() => profile?.user?.twoFactorEnabled ? setShow2FADisableModal(true) : setShow2FASetupModal(true)}
                                className="w-full flex flex-col p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-left group gap-2"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg group-hover:bg-indigo-50 transition"><Shield size={18} className="text-slate-600 group-hover:text-indigo-600" /></div>
                                        <span className="font-bold text-slate-700">2FA Protection</span>
                                    </div>
                                    {profile?.user?.twoFactorEnabled ? (
                                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                                    ) : (
                                        <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">Disabled</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">Secure your account with multi-factor authentication codes.</p>
                            </button>
                        </div>
                    </div>

                    {/* Achievement Card */}
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white text-center shadow-lg shadow-amber-100">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                            <Target size={32} />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-lg mb-1">Elite Expert</h3>
                        <p className="text-sm font-medium text-amber-50">Top 5% of contributors this month. Keep it up!</p>
                    </div>
                </div>
            </div>

            <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
            <TwoFactorSetupModal
                isOpen={show2FASetupModal}
                onClose={() => setShow2FASetupModal(false)}
                onSuccess={async () => {
                    const res = await apiClient.get('/expert/profile');
                    setProfile(res.data);
                }}
            />
            <TwoFactorDisableModal
                isOpen={show2FADisableModal}
                onClose={() => setShow2FADisableModal(false)}
                onSuccess={async () => {
                    const res = await apiClient.get('/expert/profile');
                    setProfile(res.data);
                }}
            />
        </div>
    );
};

export default ExpertProfilePage;


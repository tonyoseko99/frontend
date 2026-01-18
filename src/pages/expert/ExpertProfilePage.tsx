import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { User, BookOpen, DollarSign, Loader, AlertTriangle, Save, Camera } from 'lucide-react';

interface ExpertProfile {
    bio: string;
    subjects: string[];
    hourlyRate: number;
    qualifications: string[];
    avatarUrl?: string;
}

const ExpertProfilePage = () => {
    const [profile, setProfile] = useState<ExpertProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                // Profile might not exist yet, that's okay
                console.log('No profile found, will create new one');
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
            // Create preview
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
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccessMessage('Profile updated successfully!');
            if (res.data.profile) {
                setProfile(res.data.profile);
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to update profile. Please try again.';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border-4 border-white shadow-lg">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-slate-400" />
                            )}
                        </div>
                        <label
                            htmlFor="avatar"
                            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition"
                        >
                            <Camera size={20} />
                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-sm text-slate-500">Click the camera icon to upload a profile picture</p>
                </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
                        <User className="inline mr-2" size={16} />
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell students about yourself, your experience, and expertise..."
                    />
                </div>

                {/* Subjects */}
                <div>
                    <label htmlFor="subjects" className="block text-sm font-medium text-slate-700 mb-2">
                        <BookOpen className="inline mr-2" size={16} />
                        Subjects (comma-separated)
                    </label>
                    <input
                        id="subjects"
                        type="text"
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Mathematics, Physics, Computer Science"
                    />
                </div>

                {/* Hourly Rate */}
                <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700 mb-2">
                        <DollarSign className="inline mr-2" size={16} />
                        Hourly Rate ($)
                    </label>
                    <input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 25.00"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                        <AlertTriangle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2">
                        <Save size={20} />
                        <span>{successMessage}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                    {saving ? (
                        <>
                            <Loader className="animate-spin" size={20} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Profile
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ExpertProfilePage;

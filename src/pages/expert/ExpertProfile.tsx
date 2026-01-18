import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/client';
import { Star, Loader, AlertTriangle } from 'lucide-react';

interface Profile {
    bio: string;
    subjects: string[];
    averageRating: number;
    reviewsCount: number;
    email: string;
}

interface Review {
    rating: number;
    review: string;
    student: { email: string };
}

const ExpertProfile = () => {
    const { expertId } = useParams<{ expertId: string }>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!expertId) return;
            try {
                const profileRes = await apiClient.get(`/expert/${expertId}/profile`);
                setProfile(profileRes.data);
                const reviewsRes = await apiClient.get(`/expert/${expertId}/reviews`);
                setReviews(reviewsRes.data);
            } catch (err) {
                setError('Failed to load expert profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [expertId]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (error || !profile) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
                <AlertTriangle size={32} />
                <div>
                    <h3 className="font-bold text-lg">Error</h3>
                    <p>{error || 'Expert profile not found.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center space-x-4">
                    <img className="w-24 h-24 rounded-full" src={`https://i.pravatar.cc/150?u=${profile.email}`} alt="Expert" />
                    <div>
                        <h1 className="text-2xl font-bold">{profile.email}</h1>
                        <div className="flex items-center mt-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="ml-1 font-bold text-lg">{profile.averageRating}</span>
                            <span className="ml-2 text-gray-500">({profile.reviewsCount} reviews)</span>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">About Me</h2>
                    <p className="mt-2 text-gray-600">{profile.bio}</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Subjects</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {profile.subjects.map(subject => (
                            <span key={subject} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{subject}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="mt-4 space-y-4">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 font-semibold">{review.rating}/5</span>
                            </div>
                            <p className="mt-2 text-gray-600">{review.review}</p>
                            <p className="mt-2 text-sm text-gray-500">- {review.student.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExpertProfile;

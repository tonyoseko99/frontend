import { useEffect, useState } from 'react';
import { Star, MessageSquare, Calendar, User, Loader } from 'lucide-react';
import apiClient from '../../api/client';

interface Review {
    id: number;
    subject: string;
    rating: number;
    review: string;
    updatedAt: string;
    student: { email: string };
}

interface ReviewsData {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

const ExpertReviews = () => {
    const [data, setData] = useState<ReviewsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await apiClient.get('/expert/my-reviews');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    if (!data || data.reviews.length === 0) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                <Star size={64} className="mx-auto text-slate-200 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">No reviews yet</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Complete more orders to start receiving ratings and feedback from students!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header / Stats Summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">My Reviews & Ratings</h1>
                    <p className="text-indigo-100 flex items-center justify-center md:justify-start gap-2">
                        <MessageSquare size={18} />
                        Feedback from your students across {data.totalReviews} completed orders
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center">
                    <div className="text-5xl font-black mb-1 flex items-center gap-2">
                        {data.averageRating}
                        <Star className="text-yellow-400 fill-yellow-400" size={32} />
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-indigo-200">
                        Average Rating
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
                    Latest Feedback
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-sm">{data.totalReviews}</span>
                </h2>

                <div className="grid gap-6">
                    {data.reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
                                {/* Side Info */}
                                <div className="p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                                            />
                                        ))}
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(review.updatedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 truncate">
                                            <User size={14} />
                                            {review.student.email.split('@')[0]}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="md:col-span-3 lg:col-span-4 p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-indigo-900 text-lg group-hover:text-indigo-600 transition">
                                            {review.subject}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400 uppercase">#ORD-{review.id}</span>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed italic">
                                        "{review.review}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExpertReviews;

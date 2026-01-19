import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Slider from './Slider';

interface Review {
    id: number;
    rating: number;
    content: string;
    name: string;
    date: string;
    avatar?: string;
}

const dummyReviews: Review[] = [
    {
        id: -1,
        name: "Alex Johnson",
        content: "I was struggling with my Data Structures assignment. The expert I found here explained the concepts so clearly that I actually aced the final exam!",
        rating: 5,
        date: new Date().toISOString()
    },
    {
        id: -2,
        name: "Sarah Miller",
        content: "ProAcademic saved my semester. The quality of the thesis research provided was top-tier and delivered 2 days before the deadline.",
        rating: 5,
        date: new Date().toISOString()
    },
    {
        id: -3,
        name: "David Chen",
        content: "The escrow payment system gives me peace of mind. I only release the funds once I've reviewed the solution and verified its accuracy.",
        rating: 5,
        date: new Date().toISOString()
    }
];

const Testimonials = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/reviews');
                if (response.ok) {
                    const data = await response.json();
                    // Merge real reviews with dummies if we have few real ones
                    if (data.length > 0) {
                        setReviews([...data, ...dummyReviews.slice(0, Math.max(0, 3 - data.length))]);
                    } else {
                        setReviews(dummyReviews);
                    }
                } else {
                    setReviews(dummyReviews);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setReviews(dummyReviews);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="py-24 bg-[#F8FAFC] px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-50 -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full filter blur-3xl opacity-50 -ml-48 -mb-48" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        What Students Are <span className="text-blue-600">Saying</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Excellence in every assignment. Join thousands of students who have transformed their academic journey with our expert guidance.
                    </p>
                </div>

                <div className="relative">
                    <Slider ariaLabel="Student testimonials" className="!-mx-4" showArrows={true} showDots={true}>
                        {reviews.map((t, idx) => (
                            <div
                                key={t.id}
                                className="snap-start flex-shrink-0 w-full md:w-[450px] p-4"
                            >
                                <div className="h-full bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between relative group">
                                    <Quote className="absolute top-8 right-8 text-slate-100 group-hover:text-blue-50 transition-colors duration-500" size={60} />

                                    <div className="relative z-10">
                                        <div className="flex gap-1 mb-6">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={`${t.id}-star-${i}`}
                                                    size={18}
                                                    className={`${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors duration-300`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">
                                            "{t.content}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                                            {t.avatar ? (
                                                <img
                                                    src={t.avatar}
                                                    alt={t.name}
                                                    className="w-full h-full rounded-2xl object-cover"
                                                />
                                            ) : (
                                                <User className="text-white" size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                                            <p className="text-sm font-medium text-blue-500 uppercase tracking-wider">
                                                {new Date(t.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
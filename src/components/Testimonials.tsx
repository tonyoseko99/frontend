import { Star, Quote } from 'lucide-react';
import Slider from './Slider';

const testimonials = [
    {
        id: 'alex-johnson',
        name: "Alex Johnson",
        role: "Computer Science Student",
        content: "I was struggling with my Data Structures assignment. The expert I found here explained the concepts so clearly that I actually aced the final exam!",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=alex"
    },
    {
        id: 'sarah-miller',
        name: "Sarah Miller",
        role: "Economics Major",
        content: "ProAcademic saved my semester. The quality of the thesis research provided was top-tier and delivered 2 days before the deadline.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        id: 'david-chen',
        name: "David Chen",
        role: "Engineering Student",
        content: "The escrow payment system gives me peace of mind. I only release the funds once I've reviewed the solution and verified its accuracy.",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?u=david"
    },
    {
        id: 'jane-smith',
        name: "Jane Smith",
        role: "Business Student",
        content: "I've been struggling with my Business Law assignment for the past few months. I found a tutor who was able to explain the concepts in a clear and concise manner.",
        rating: 4,
        avatar: "https://i.pravatar.cc/150?u=jane"
    },
    {
        id: 'john-doe',
        name: "John Doe",
        role: "Computer Science Student",
        content: "I've been struggling with my Data Structures assignment for the past few months. I found a tutor who was able to explain the concepts in a clear and concise manner.",
        rating: 3,
        avatar: "https://i.pravatar.cc/150?u=tony"
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-white px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Students Are Saying</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Join thousands of students who have leveled up their academic performance with our help.
                    </p>
                </div>

                <div className="relative">
                    <Slider ariaLabel="Student testimonials" className="">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="snap-start flex-shrink-0 w-full md:w-1/2 lg:w-1/3 bg-slate-50 p-8 rounded-3xl relative border border-slate-100 transition-transform hover:-translate-y-2"
                            >
                                <Quote className="absolute top-6 right-8 text-blue-100" size={40} />

                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={`${t.id}-star-${i}`} size={16} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                <p className="text-slate-700 italic mb-8 relative z-10">"{t.content}"</p>

                                <div className="flex items-center gap-4">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.name}</h4>
                                        <p className="text-sm text-slate-500">{t.role}</p>
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
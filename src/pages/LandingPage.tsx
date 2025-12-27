import { Link } from 'react-router-dom';
import {
    CheckCircle,
    ShieldCheck,
    Zap,
    Star,
    ArrowRight,
    GraduationCap,
    Users
} from 'lucide-react';
import Testimonials from "../components/Testimonials";

const LandingPage = () => {
    return (
        <div className="bg-white text-slate-900 font-sans">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ProAcademic</span>
                </div>
                <div className="hidden md:flex gap-8 font-medium text-slate-600">
                    <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
                    <a href="#features" className="hover:text-blue-600 transition">Features</a>
                    <a href="#experts" className="hover:text-blue-600 transition">Our Experts</a>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-5 py-2.5 font-semibold hover:text-blue-600 transition">Log in</Link>
                    <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative px-8 py-20 lg:py-32 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8">
                    <Star size={16} fill="currentColor" />
                    <span>Trusted by 10,000+ students worldwide</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                    Master Your Academics with <br />
                    <span className="text-blue-600">Verified Experts.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    From complex calculus to advanced thesis writing—connect with specialized tutors
                    ready to help you achieve the grades you deserve. Fast, secure, and professional.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xl shadow-blue-200">
                        Post Your First Task <ArrowRight size={20} />
                    </Link>
                    <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition">
                        Browse Experts
                    </button>
                </div>

                {/* Floating Abstract Elements */}
                <div className="hidden lg:block absolute top-1/4 -left-10 opacity-20">
                    <Zap size={120} className="text-blue-600 animate-pulse" />
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="bg-slate-50 py-24 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Choose ProAcademic?</h2>
                        <p className="text-slate-500">The safest platform for academic excellence.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<ShieldCheck className="text-blue-600" />}
                            title="Secure Payments"
                            desc="Funds are held in escrow and only released when you're 100% satisfied with the work."
                        />
                        <FeatureCard
                            icon={<Users className="text-blue-600" />}
                            title="Verified Experts"
                            desc="Our tutors undergo rigorous background checks and competency tests in their specific fields."
                        />
                        <FeatureCard
                            icon={<CheckCircle className="text-blue-600" />}
                            title="24/7 Support"
                            desc="Round-the-clock assistance for urgent assignments and tight deadlines."
                        />
                    </div>
                </div>
            </section>

            <Testimonials />

            {/* Social Proof / Stats */}
            <section className="py-20 px-8 max-w-7xl mx-auto border-t border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">99%</div>
                        <div className="text-slate-500 font-medium">Satisfaction Rate</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">24h</div>
                        <div className="text-slate-500 font-medium">Avg. Turnaround</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">500+</div>
                        <div className="text-slate-500 font-medium">Verified Experts</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">15k+</div>
                        <div className="text-slate-500 font-medium">Orders Completed</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <GraduationCap size={24} className="text-blue-500" />
                        <span className="text-xl font-bold">ProAcademic</span>
                    </div>
                    <p className="text-slate-400 text-sm">© 2025 ProAcademic Marketplace. All rights reserved.</p>
                    <div className="flex gap-6 text-slate-400">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: any) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
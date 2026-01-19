import { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Zap,
    Star,
    ArrowRight,
    GraduationCap,
    Users,
    ChevronDown,
    Globe,
    Lock,
    Trophy
} from 'lucide-react';
import Testimonials from "../components/Testimonials";
import AuthModal from '../components/AuthModal';
import CostCalculator from '../components/CostCalculator';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openAuth = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Animated Glow Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ProAcademic</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        {['How it Works', 'Calculator', 'Features', 'Tutors'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                                className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-tight"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <button
                            onClick={() => openAuth('login')}
                            className="hidden md:block text-sm font-bold hover:text-blue-400 transition"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => openAuth('register')}
                            className="bg-white text-[#020617] px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-50 transition shadow-xl shadow-white/5 hover:-translate-y-0.5"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 max-w-7xl mx-auto z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] text-blue-400 shadow-xl">
                        <Star size={14} className="fill-blue-400" />
                        <span>The Gold Standard of Academic Support</span>
                    </div>

                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.95] max-w-5xl">
                        Academics, <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500">Perfected.</span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                        Precision <span className="text-white">Proctored Exam Assistance</span>, PhD-level Research, and Advanced <span className="text-white">CS Engineering</span>. Seamless. Secure. State-of-the-art.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => openAuth('register')}
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-[2rem] text-lg font-black hover:shadow-2xl hover:shadow-blue-500/20 transition flex items-center justify-center gap-3 hover:-translate-y-1"
                        >
                            Propel Your Research <ArrowRight size={20} />
                        </button>
                        <a href="#calculator" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-white/10 transition flex items-center justify-center gap-2">
                            View Pricing
                        </a>
                    </div>

                    <div className="pt-20 animate-bounce text-slate-500">
                        <ChevronDown size={32} />
                    </div>
                </div>
            </header>

            {/* Specialized Services Section (SEO Hotspot) */}
            <section className="py-24 px-6 relative z-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-tighter">Proctored Exams</h2>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Navigate high-stakes <span className="text-slate-200">timed assessments</span> and <span className="text-slate-200">proctored quizzes</span> with confidence. Our experts provide real-time strategic support for complex STEM and Humanities examinations.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-400 uppercase tracking-tighter">Research Engineering</h2>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                From <span className="text-slate-200">PhD Thesis Architecting</span> to high-impact journal publications. We engineer deep-tech research papers that meet the most rigorous academic standards globally.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-purple-400 uppercase tracking-tighter">CS / Software Code</h2>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Expert-grade <span className="text-slate-200">Software Engineering</span> for computer science students. Debugging, system architecture, and full-stack development implementations that earn top-tier grades.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intelligent Calculator Section */}
            <section id="calculator" className="relative py-32 px-6 z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Precision <span className="text-blue-500">Pricing.</span></h2>
                        <p className="text-slate-400 max-w-xl mx-auto font-medium">Use our intelligent engine to get a real-time estimate based on your specific complexity requirements.</p>
                    </div>
                    <CostCalculator />
                </div>
            </section>

            {/* Features BENTO Grid */}
            <section id="features" className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-12 md:grid-rows-2 gap-6 h-[800px] md:h-[600px]">
                        {/* Featured Card */}
                        <div className="md:col-span-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-end group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-500"><Globe size={200} /></div>
                            <div className="relative z-10 space-y-4">
                                <div className="p-3 bg-blue-500 rounded-2xl w-fit text-white shadow-lg shadow-blue-500/20"><ShieldCheck size={32} /></div>
                                <h3 className="text-3xl font-black tracking-tight">Escrow Protected Excellence</h3>
                                <p className="text-slate-400 max-w-md font-medium">Your funds are only released when the work exceeds your expectations. Total security, guaranteed results.</p>
                            </div>
                        </div>

                        {/* Side Card 1 */}
                        <div className="md:col-span-4 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-10 flex flex-col justify-between text-white shadow-2xl">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Zap size={24} /></div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black tracking-tight">Real-time Exam Support</h3>
                                <p className="text-indigo-100/70 text-sm font-medium">Immediate assistance for <span className="text-white font-bold">Proctored Exams</span>, timed quizzes, and coding tests with PhD-level precision.</p>
                            </div>
                        </div>

                        {/* Bottom Card 1 */}
                        <div className="md:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white"><Lock size={24} /></div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-black tracking-tight">Full Anonymity</h3>
                                <p className="text-slate-500 text-sm font-medium">Your data is encrypted and kept private. Zero secondary data sharing.</p>
                            </div>
                        </div>

                        {/* Bottom Card 2 */}
                        <div className="md:col-span-8 bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 group">
                            <div className="flex-1 space-y-4">
                                <div className="text-blue-500 font-black uppercase tracking-widest text-xs flex items-center gap-2"><Trophy size={16} /> Merit Awarded</div>
                                <h3 className="text-3xl font-black tracking-tight">Verified Specialist Network</h3>
                                <p className="text-slate-400 font-medium">Our rigor is unmatched. Only the top 2% of applicants clear our competency vetting.</p>
                            </div>
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-14 h-14 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden flex items-center justify-center">
                                        <Users size={24} className="text-slate-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bg-[#020617] relative z-10 pt-20">
                <Testimonials />
            </div>

            {/* Global Stats */}
            <section className="py-32 px-6 relative z-10 max-w-7xl mx-auto border-t border-white/5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {[
                        { val: '99.8%', label: 'Quality Score' },
                        { val: 'PhD', label: 'Verified Experts' },
                        { val: '80ms', label: 'Avg Latency' },
                        { val: '8m+', label: 'Words Crafted' }
                    ].map(stat => (
                        <div key={stat.label} className="space-y-2">
                            <div className="text-4xl lg:text-6xl font-black text-white tracking-tighter">{stat.val}</div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-2 space-y-6 text-center md:text-left">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <div className="bg-blue-600 p-2 rounded-xl text-white"><GraduationCap size={20} /></div>
                                <span className="text-2xl font-black tracking-tighter">ProAcademic</span>
                            </div>
                            <p className="text-slate-500 max-w-sm font-medium">The world's most advanced marketplace for academic engineering and precision research assistance.</p>
                        </div>
                        <div className="space-y-4 text-center md:text-right">
                            <h4 className="font-black uppercase tracking-widest text-xs text-slate-200">Network</h4>
                            <div className="flex flex-col gap-2 text-sm text-slate-500 font-bold">
                                <a href="#" className="hover:text-blue-500 transition">Our Experts</a>
                                <a href="#" className="hover:text-blue-500 transition">Case Studies</a>
                                <a href="#" className="hover:text-blue-500 transition">Methodology</a>
                            </div>
                        </div>
                        <div className="space-y-4 text-center md:text-right">
                            <h4 className="font-black uppercase tracking-widest text-xs text-slate-200">Legal</h4>
                            <div className="flex flex-col gap-2 text-sm text-slate-500 font-bold">
                                <a href="#" className="hover:text-blue-500 transition">Security Policy</a>
                                <a href="#" className="hover:text-blue-500 transition">User Privacy</a>
                                <a href="#" className="hover:text-blue-500 transition">Escrow Terms</a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">© 2025 ProAcademic Marketplace Architecture. All Rights Reserved.</p>
                        <div className="flex gap-4">
                            {['TW', 'LI', 'GH'].map(social => (
                                <div key={social} className="w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">{social}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
};

export default LandingPage;
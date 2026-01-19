import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, GraduationCap, ChevronRight, Zap, Layers, FileText, Code } from 'lucide-react';
import {
    ACADEMIC_LEVELS,
    ASSIGNMENT_TYPES,
    DEADLINES,
    PROJECT_SCALES,
    calculateEstimatedPrice
} from '../utils/pricing';

const CostCalculator = () => {
    const [level, setLevel] = useState(ACADEMIC_LEVELS[1]);
    const [type, setType] = useState(ASSIGNMENT_TYPES[0]);
    const [urgency, setUrgency] = useState(DEADLINES[1]);

    // Scope states
    const [words, setWords] = useState(1000);
    const [problems, setProblems] = useState(5);
    const [pages, setPages] = useState(10);
    const [projectScale, setProjectScale] = useState(PROJECT_SCALES[1]);

    const [estimatedPrice, setEstimatedPrice] = useState(0);

    useEffect(() => {
        const price = calculateEstimatedPrice({
            level: level.label,
            type: type.label,
            urgency: urgency.label,
            words,
            problems,
            pages,
            projectScale: projectScale.label
        });
        setEstimatedPrice(price);
    }, [level, type, urgency, words, problems, pages, projectScale]);

    return (
        <div id="calculator" className="w-full max-w-5xl mx-auto p-1 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>

            <div className="bg-white/95 backdrop-blur-md rounded-[2.2rem] p-8 md:p-12 border border-white/20 relative z-10 flex flex-col xl:flex-row gap-12">

                {/* Inputs Section */}
                <div className="flex-1 space-y-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-2">
                            <Layers size={14} className="animate-bounce" />
                            <span className="text-xs font-black uppercase tracking-widest">Intelligent Scoping Engine</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            Tailored <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Estimations.</span>
                        </h2>
                        <p className="text-slate-500 font-medium">Precision pricing that accounts for the depth and volume of your work.</p>
                    </div>

                    <div className="space-y-8">
                        {/* 1. Academic Level */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <GraduationCap size={16} /> Academic Level
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {ACADEMIC_LEVELS.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setLevel(item)}
                                        className={`px-4 py-3 rounded-2xl text-[10px] md:text-sm font-bold transition-all border-2 ${level.label === item.label
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Assignment Type */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <BookOpen size={16} /> Assignment Category
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {ASSIGNMENT_TYPES.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setType(item)}
                                        className={`px-4 py-3 rounded-2xl text-[10px] md:text-sm font-bold transition-all border-2 ${type.label === item.label
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'}`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <item.icon size={18} />
                                            {item.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Scope / Volume (DYNAMIC) */}
                        <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Layers size={16} /> Work Volume / Scope
                            </label>

                            {type.label === 'Essay / General' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black text-slate-900">{words} <span className="text-slate-400 text-sm">Words</span></span>
                                        <span className="text-xs font-bold text-slate-400">~{Math.ceil(words / 250)} Pages</span>
                                    </div>
                                    <input
                                        type="range" min="250" max="10000" step="250"
                                        value={words} onChange={(e) => setWords(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            )}

                            {type.label === 'STEM Problems' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black text-slate-900">{problems} <span className="text-slate-400 text-sm">Problems</span></span>
                                        <span className="text-xs font-bold text-slate-400">Complex Equations / Sets</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="30" step="1"
                                        value={problems} onChange={(e) => setProblems(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            )}

                            {type.label === 'Software / Code' && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {PROJECT_SCALES.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => setProjectScale(item)}
                                            className={`px-4 py-3 rounded-xl text-xs font-black transition-all border-2 ${projectScale.label === item.label
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {type.label === 'Thesis / Research' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-black text-slate-900">{pages} <span className="text-slate-400 text-sm">Pages</span></span>
                                        <span className="text-xs font-bold text-slate-400">Academic Standard</span>
                                    </div>
                                    <input
                                        type="range" min="5" max="100" step="5"
                                        value={pages} onChange={(e) => setPages(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 4. Urgency */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Clock size={16} /> Priority / Deadline
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DEADLINES.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setUrgency(item)}
                                        className={`px-4 py-3 rounded-2xl text-[10px] md:text-sm font-bold transition-all border-2 ${urgency.label === item.label
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-100'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-purple-200'}`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estimate Section */}
                <div className="xl:w-96 bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <div className="relative space-y-8">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Investment Estimate</span>
                            <div className="mt-6 flex flex-col">
                                <div className="flex items-start text-white">
                                    <span className="text-3xl font-bold mt-3 opacity-50 mr-1">$</span>
                                    <span className="text-8xl font-black tracking-tighter leading-none">
                                        {estimatedPrice}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm font-medium mt-4 leading-relaxed">Includes expert vetting, quality assurance, and 24/7 priority support.</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Configuration Summary</h4>
                            <div className="space-y-3">
                                <SummaryRow label="Complexity" value={level.label} />
                                <SummaryRow label="Category" value={type.label} />
                                <SummaryRow label="Intensity" value={urgency.label} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4 relative">
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] font-black group flex items-center justify-center gap-3 transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1">
                            Connect with Experts
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest">Prices may vary based on specific expert bids</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const SummaryRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex items-center justify-between group">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-300 transition-colors group-hover:text-blue-400">{value}</span>
    </div>
);

export default CostCalculator;

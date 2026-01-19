import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, Info, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import apiClient from '../../api/client';
import {
    ACADEMIC_LEVELS,
    ASSIGNMENT_TYPES,
    DEADLINES,
    PROJECT_SCALES,
    calculateEstimatedPrice
} from '../../utils/pricing';

const CreateOrder = () => {
    const [formData, setFormData] = useState({
        subject: '',
        deadline: DEADLINES[1].label,
        price: '',
        description: '',
        academicLevel: ACADEMIC_LEVELS[1].label,
        category: ASSIGNMENT_TYPES[0].label
    });

    // Scope states
    const [words, setWords] = useState(1000);
    const [problems, setProblems] = useState(5);
    const [pages, setPages] = useState(10);
    const [projectScale, setProjectScale] = useState(PROJECT_SCALES[1].label);

    const [files, setFiles] = useState<FileList | null>(null);
    const [showValidation, setShowValidation] = useState(false);
    const [validationMessage, setValidationMessage] = useState<{
        type: 'low' | 'high' | 'fair',
        suggestedPrice: number,
        diff: number
    } | null>(null);

    const navigate = useNavigate();

    const systemEstimate = calculateEstimatedPrice({
        level: formData.academicLevel,
        type: formData.category,
        urgency: formData.deadline,
        words,
        problems,
        pages,
        projectScale
    });

    const userPrice = parseFloat(formData.price) || 0;

    const handleBudgetValidation = () => {
        if (!formData.price) return true;

        const diff = userPrice - systemEstimate;
        const threshold = systemEstimate * 0.15; // 15% tolerance

        if (diff < -threshold) {
            setValidationMessage({ type: 'low', suggestedPrice: systemEstimate, diff: Math.abs(diff) });
            setShowValidation(true);
            return false;
        } else if (diff > threshold) {
            setValidationMessage({ type: 'high', suggestedPrice: systemEstimate, diff });
            setShowValidation(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent, force: boolean = false) => {
        if (e) e.preventDefault();

        if (!force && !handleBudgetValidation()) return;

        try {
            const fd = new FormData();
            fd.append('subject', formData.subject);
            fd.append('price', formData.price.toString());
            fd.append('deadline', formData.deadline);
            fd.append('description', formData.description || '');
            fd.append('category', formData.category);
            fd.append('academicLevel', formData.academicLevel);

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    fd.append('docs', files[i]);
                }
            }

            await apiClient.post('/student/orders', fd);
            navigate('/dashboard/orders');
        } catch (error) {
            console.error('Create order failed:', error);
            alert("Failed to create task. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition font-bold uppercase text-xs tracking-widest">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-10 border-b border-slate-50">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Post New Task</h2>
                            <p className="text-slate-500 font-medium">Connect with top experts for your academic needs.</p>
                        </div>

                        <form className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Task Subject</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
                                        placeholder="e.g., Advanced Quantum Mechanics"
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Academic Level</label>
                                        <select
                                            value={formData.academicLevel}
                                            onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none bg-white"
                                        >
                                            {ACADEMIC_LEVELS.map(l => <option key={l.label} value={l.label}>{l.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none bg-white"
                                        >
                                            {ASSIGNMENT_TYPES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Dynamic Scope Fields */}
                                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-6">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <Lightbulb size={16} /> Precision Scoping
                                    </label>

                                    {formData.category === 'Essay / General' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xl font-black text-slate-900">{words} <span className="text-slate-400 text-sm">Words</span></span>
                                                <span className="text-xs font-bold text-slate-400">~{Math.ceil(words / 250)} Pages</span>
                                            </div>
                                            <input type="range" min="250" max="10000" step="250" value={words} onChange={(e) => setWords(parseInt(e.target.value))} className="w-full" />
                                        </div>
                                    )}

                                    {formData.category === 'STEM Problems' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xl font-black text-slate-900">{problems} <span className="text-slate-400 text-sm">Problems</span></span>
                                            </div>
                                            <input type="range" min="1" max="50" step="1" value={problems} onChange={(e) => setProblems(parseInt(e.target.value))} className="w-full" />
                                        </div>
                                    )}

                                    {formData.category === 'Software / Code' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {PROJECT_SCALES.map(s => (
                                                <button
                                                    key={s.label} type="button"
                                                    onClick={() => setProjectScale(s.label)}
                                                    className={`px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all ${projectScale === s.label ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'}`}
                                                >
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {formData.category === 'Thesis / Research' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xl font-black text-slate-900">{pages} <span className="text-slate-400 text-sm">Pages</span></span>
                                            </div>
                                            <input type="range" min="5" max="100" step="5" value={pages} onChange={(e) => setPages(parseInt(e.target.value))} className="w-full" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Deadline</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700"
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Proposed Budget ($)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700"
                                            placeholder="e.g., 50"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Detailed Instructions</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none font-medium text-slate-700"
                                        placeholder="Describe the task in detail..."
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Attachments</label>
                                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 transition cursor-pointer relative group">
                                        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="text-center group-hover:scale-105 transition-transform">
                                            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <TrendingUp className="text-slate-400" size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600">Upload assignment details, rubrics, or codebase</p>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">Click or drag & drop files here</p>
                                        </div>
                                    </div>
                                    {files && files.length > 0 && (
                                        <ul className="mt-4 space-y-2">
                                            {Array.from(files).map((f, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
                                                    <Info size={14} /> {f.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e as any)}
                                className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-lg shadow-2xl transition-all hover:-translate-y-1"
                            >
                                Post Task & Find Experts
                            </button>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Budget Advisor Widget */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Lightbulb className="text-amber-500" size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Budget Advisor</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Investment</span>
                                <div className="text-4xl font-black text-slate-900">${systemEstimate}</div>
                            </div>

                            <div className="space-y-3">
                                <SummaryItem label="Level" value={formData.academicLevel} />
                                <SummaryItem label="Complexity" value={formData.category} />
                                <SummaryItem label="Scope" value={formData.category === 'Essay / General' ? `${words} words` : formData.category === 'STEM Problems' ? `${problems} problems` : formData.category === 'Software / Code' ? projectScale : `${pages} pages`} />
                            </div>

                            {userPrice > 0 && (
                                <div className={`p-4 rounded-xl flex items-start gap-3 border-2 ${Math.abs(userPrice - systemEstimate) <= systemEstimate * 0.15
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                        : userPrice < systemEstimate ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                                    }`}>
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <div className="text-xs font-bold leading-relaxed">
                                        {Math.abs(userPrice - systemEstimate) <= systemEstimate * 0.15
                                            ? "Your budget is perfectly aligned with expert expectations. This will likely attract high-quality bids quickly."
                                            : userPrice < systemEstimate
                                                ? `Your budget is roughly $${Math.abs(Math.round(userPrice - systemEstimate))} below our estimate. Experts may request more, or you might receive fewer high-tier bids.`
                                                : `Your budget is very generous! You're offering $${Math.abs(Math.round(userPrice - systemEstimate))} more than our fair estimate.`
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Modal */}
            {showValidation && validationMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl p-12 shadow-2xl space-y-8 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 ${validationMessage.type === 'high' ? 'bg-blue-500/20' : 'bg-amber-500/20'}`}></div>

                        <div className="space-y-2 text-center relative">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${validationMessage.type === 'high' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                {validationMessage.type === 'high' ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {validationMessage.type === 'high' ? 'Generous Budget Detected!' : 'Budget Readjustment Recommended'}
                            </h3>
                            <p className="text-slate-500 font-medium">
                                {validationMessage.type === 'high'
                                    ? "Your proposed budget is significantly higher than our system's fair estimate for this task."
                                    : "Experts typically require a bit more for tasks of this complexity and scope."}
                            </p>
                        </div>

                        <div className="flex bg-slate-50 rounded-[2rem] p-8 items-center justify-center gap-12 border border-slate-100">
                            <div className="text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Your Proposed</span>
                                <div className="text-3xl font-black text-slate-900">${userPrice}</div>
                            </div>
                            <div className="h-10 w-px bg-slate-200"></div>
                            <div className="text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Fair Estimate</span>
                                <div className="text-3xl font-black text-blue-600">${validationMessage.suggestedPrice}</div>
                            </div>
                        </div>

                        {validationMessage.type === 'high' ? (
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                                <Lightbulb className="text-blue-600 shrink-0" size={24} />
                                <p className="text-sm font-bold text-blue-800 leading-relaxed">
                                    Tip: You can lower your base budget to <span className="underline">${validationMessage.suggestedPrice}</span> and add the extra <span className="underline">${validationMessage.diff}</span> as a tip for exceptional performance!
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                                <p className="text-sm font-bold text-amber-800 leading-relaxed">
                                    Increasing your budget to <span className="underline">${validationMessage.suggestedPrice}</span> will make your task stand out and attract the highest-rated experts immediately.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, price: validationMessage.suggestedPrice.toString() });
                                    setShowValidation(false);
                                }}
                                className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition text-sm"
                            >
                                <Check size={18} /> Apply Suggested Price
                            </button>
                            <button
                                onClick={() => handleSubmit(null as any, true)}
                                className="flex-1 bg-white border-2 border-slate-100 text-slate-400 py-5 rounded-2xl font-bold hover:bg-slate-50 transition text-sm"
                            >
                                Keep My Price
                            </button>
                        </div>

                        <button
                            onClick={() => setShowValidation(false)}
                            className="w-full text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition"
                        >
                            Cancel & Edit Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex items-center justify-between group">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-slate-700">{value}</span>
    </div>
);

export default CreateOrder;
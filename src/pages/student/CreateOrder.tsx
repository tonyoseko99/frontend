import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import apiClient from '../../api/client';

const CreateOrder = () => {
    const [formData, setFormData] = useState({ subject: '', deadline: '', price: '', description: '' });
    const [files, setFiles] = useState<FileList | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('subject', formData.subject);
            fd.append('price', formData.price.toString());
            fd.append('deadline', formData.deadline);
            fd.append('description', formData.description || '');

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    fd.append('docs', files[i]); // 'docs' matches upload.array('docs', 5) on the backend
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
        <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition">
                <ArrowLeft size={18} /> Back
            </button>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                    <h2 className="text-2xl font-bold text-slate-800">Post New Academic Task</h2>
                    <p className="text-slate-500">Provide clear instructions to get the best results from experts.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Subject / Topic</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="e.g., Advanced Macroeconomics"
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Budget ($)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="0.00"
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Deadline</label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Instructions</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Describe the task in detail..."
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Attachments</label>
                        <input
                            type="file"
                            name="docs"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            className="w-full"
                        />
                        {files && files.length > 0 && (
                            <ul className="mt-2 text-sm text-slate-600">
                                {Array.from(files).map((f, idx) => (
                                    <li key={idx}>{f.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 transition-all">
                        Post Task & Find Experts
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
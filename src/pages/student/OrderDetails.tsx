import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import Chat from '../../components/Chat';
import {
    Calendar,
    DollarSign,
    FileText,
    Star,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    Paperclip,
    ChevronRight,
    Send
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

interface FileItem {
    id: number;
    url: string;
    name: string;
}

interface Order {
    id: number;
    subject: string;
    description?: string | null;
    status: string;
    deadline: string;
    price: number;
    files?: FileItem[];
    expert?: { id?: number; email?: string } | null;
    rating?: number;
    review?: string;
}

const OrderDetails = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisionNotes, setRevisionNotes] = useState('');
    const [submittingRevision, setSubmittingRevision] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showRevisionConfirm, setShowRevisionConfirm] = useState(false);

    const fetchOrder = () => {
        if (!orderId) return;
        setLoading(true);
        apiClient.get(`/student/orders/${orderId}`)
            .then(res => setOrder(res.data))
            .catch(err => {
                console.error('Failed to fetch order:', err);
                alert('Could not load order details');
                navigate('/dashboard/orders');
            })
            .finally(() => setLoading(false));
    };

    useEffect(fetchOrder, [orderId, navigate]);

    const handlePay = async () => {
        if (!order) return;
        try {
            const resp = await apiClient.post('/payment/create-checkout-session', { orderId: order.id });
            const { url } = resp.data;
            if (url) {
                globalThis.location.assign(url);
            } else {
                alert('Payment currently unavailable');
            }
        } catch (err) {
            console.error('Payment init failed', err);
            alert('Could not initiate payment');
        }
    };

    const handleApprove = async () => {
        if (!order) return;
        setShowApproveConfirm(true);
    };

    const confirmApprove = async () => {
        if (!order) return;
        console.log('Making API call...');
        try {
            await apiClient.post(`/student/orders/${order.id}/approve`);
            console.log('API call successful');
            fetchOrder(); // Refresh to show updated status
            alert('Order approved successfully! Payment has been released to the expert.');
        } catch (err) {
            console.error('Failed to approve order', err);
            alert('Could not approve order. Please try again.');
        }
    };

    const handleRequestRevision = async () => {
        if (!order || !revisionNotes.trim()) return;
        setShowRevisionConfirm(true);
    };

    const confirmRevision = async () => {
        if (!order || !revisionNotes.trim()) return;
        setSubmittingRevision(true);
        try {
            await apiClient.post(`/student/orders/${order.id}/request-revision`, {
                revisionNotes: revisionNotes.trim()
            });
            setShowRevisionModal(false);
            setRevisionNotes('');
            fetchOrder(); // Refresh to show updated status
            alert('Revision requested successfully! The expert has been notified.');
        } catch (err) {
            console.error('Failed to request revision', err);
            alert('Could not request revision. Please try again.');
        } finally {
            setSubmittingRevision(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!order) return;
        try {
            await apiClient.post(`/student/orders/${order.id}/review`, { rating, review });
            fetchOrder();
        } catch (err) {
            console.error('Failed to submit review', err);
            alert('Could not submit review.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order || !orderId) {
        return (
            <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">Order not found</h3>
            </div>
        );
    }

    console.log('Order status:', order.status);
    console.log('Is REVIEW?:', order.status === 'REVIEW');

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-slate-500 space-x-2">
                <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition">Dashboard</button>
                <ChevronRight size={16} />
                <button onClick={() => navigate('/dashboard/orders')} className="hover:text-blue-600 transition">Orders</button>
                <ChevronRight size={16} />
                <span className="text-slate-900 font-medium">#{order.id}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={20} />
                                    <span className="text-sm opacity-90">Order #{order.id}</span>
                                </div>
                                <h1 className="text-2xl font-bold mb-3">{order.subject}</h1>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <Calendar size={16} />
                                        <span>{new Date(order.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <DollarSign size={16} />
                                        <span className="font-semibold">${order.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getStatusBadge(order.status)}
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={handlePay}
                                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <FileText size={20} className="text-blue-600" />
                                Instructions
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-700 leading-relaxed">
                                {order.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Solution Files - Only show when status is REVIEW */}
                    {order.status === 'REVIEW' && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-4 border-b border-green-200">
                                <h2 className="font-bold text-green-900 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-600" />
                                    Submitted Solution - Ready for Review
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-green-800 mb-4 font-medium">
                                    The expert has submitted their work. Please review the solution files below before approving or rejecting.
                                </p>

                                {/* Filter files where isSolution is true */}
                                {order.files && order.files.filter((f: any) => f.isSolution).length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                        {order.files.filter((f: any) => f.isSolution).map(f => (
                                            <a
                                                key={f.id}
                                                href={`/${f.url.split('/').pop()}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex items-center gap-3 p-4 bg-white border-2 border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition shadow-sm"
                                            >
                                                {renderFilePreview(f)}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-slate-900 truncate group-hover:text-green-700 transition">
                                                        {f.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 uppercase">
                                                        {humanFileType(f.name)}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-green-700 bg-white rounded-xl mb-6">
                                        <AlertCircle size={40} className="mx-auto mb-2 opacity-50" />
                                        <p>No solution files found</p>
                                    </div>
                                )}

                                {/* Approve/Reject Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleApprove}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-md flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        Approve & Complete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRevisionModal(true)}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition shadow-md flex items-center justify-center gap-2"
                                    >
                                        <AlertCircle size={20} />
                                        Request Revision
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attachments Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <Paperclip size={20} className="text-blue-600" />
                                Attachments ({order.files?.length || 0})
                            </h2>
                        </div>
                        <div className="p-6">
                            {order.files && order.files.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {order.files.map(f => (
                                        <a
                                            key={f.id}
                                            href={`/${f.url.split('/').pop()}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
                                        >
                                            {renderFilePreview(f)}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-slate-900 truncate group-hover:text-blue-600 transition">
                                                    {f.name}
                                                </div>
                                                <div className="text-xs text-slate-500 uppercase">
                                                    {humanFileType(f.name)}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <Paperclip size={40} className="mx-auto mb-2 opacity-50" />
                                    <p>No attachments</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Section */}
                    {order.status === 'COMPLETED' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-slate-200">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Star size={20} className="text-yellow-600" />
                                    {order.rating ? 'Your Review' : 'Leave a Review'}
                                </h2>
                            </div>
                            <div className="p-6">
                                {order.rating ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={24}
                                                    className={i < order.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed">{order.review}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                                            <div className="flex items-center gap-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={32}
                                                        onClick={() => setRating(i + 1)}
                                                        className={`cursor-pointer transition ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 hover:text-yellow-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                                            <textarea
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                rows={4}
                                                placeholder="Share your experience with this expert..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Info Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="font-bold text-slate-900">Order Details</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Clock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Deadline</div>
                                    <div className="font-semibold text-slate-900">
                                        {new Date(order.deadline).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {order.expert && (
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <User size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500">Assigned Expert</div>
                                        <div className="font-semibold text-slate-900">{order.expert.email}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Card */}
                    {order.status !== 'PENDING' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Chat orderId={orderId} isLocked={order.status === 'COMPLETED'} />
                        </div>
                    )}
                </div>
            </div>
            {/* Revision Request Modal */}
            {showRevisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <AlertCircle size={24} />
                                Request Revision
                            </h3>
                            <button
                                onClick={() => setShowRevisionModal(false)}
                                className="hover:bg-white/20 p-1 rounded-lg transition"
                            >
                                <ChevronRight className="rotate-90" size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    What changes would you like the expert to make?
                                </label>
                                <textarea
                                    value={revisionNotes}
                                    onChange={(e) => setRevisionNotes(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[150px]"
                                    placeholder="Please be specific about what needs to be changed or improved..."
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowRevisionModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRequestRevision}
                                    disabled={submittingRevision || !revisionNotes.trim()}
                                    className="flex-2 bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {submittingRevision ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Submit Request
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={showApproveConfirm}
                onClose={() => setShowApproveConfirm(false)}
                onConfirm={confirmApprove}
                title="Approve Work?"
                message="Are you sure you want to approve this work? This will mark the order as completed and release payment to the expert. This action cannot be undone."
                confirmLabel="Yes, Approve & Pay"
                type="success"
            />

            <ConfirmationModal
                isOpen={showRevisionConfirm}
                onClose={() => setShowRevisionConfirm(false)}
                onConfirm={confirmRevision}
                title="Request Revision?"
                message="Are you sure you want to request a revision? This will send the work back to the expert for further improvements."
                confirmLabel="Yes, Request Revision"
                type="warning"
            />
        </div>
    );
};

const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: any }> = {
        'PAID': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
        'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
        'ASSIGNED': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
        'IN_PROGRESS': { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Clock },
        'REVIEW': { bg: 'bg-orange-100', text: 'text-orange-700', icon: Star },
        'COMPLETED': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
    };

    const config = configs[status] || { bg: 'bg-slate-100', text: 'text-slate-700', icon: AlertCircle };
    const Icon = config.icon;

    return (
        <div className={`${config.bg} ${config.text} px-3 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2`}>
            <Icon size={16} />
            {status}
        </div>
    );
};

const humanFileType = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return 'file';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'document';
    if (['xls', 'xlsx'].includes(ext)) return 'spreadsheet';
    return ext;
};

const renderFilePreview = (file: FileItem) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) {
        const src = `/uploads/${file.url.split('/').pop()}`;
        return (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={src} alt={file.name} className="w-full h-full object-cover" />
            </div>
        );
    }

    if (ext === 'pdf') {
        return (
            <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded-lg flex-shrink-0">
                <FileText size={24} className="text-red-600" />
            </div>
        );
    }

    return (
        <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-lg text-xs font-bold text-slate-600 flex-shrink-0 uppercase">
            {ext}
        </div>
    );
};

export default OrderDetails;

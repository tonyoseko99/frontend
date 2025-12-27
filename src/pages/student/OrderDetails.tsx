import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

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
}

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        apiClient.get(`/student/orders/${id}`)
            .then(res => setOrder(res.data))
            .catch(err => {
                console.error('Failed to fetch order:', err);
                alert('Could not load order details');
                navigate('/dashboard/orders');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

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

    if (loading) return <div className="p-4">Loading...</div>;
    if (!order) return <div className="p-4">Order not found</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-4">{/* reduced padding */}
            <div className="flex items-start justify-between gap-4 mb-3">{/* tighter spacing */}
                <div>
                    <nav className="text-xs text-slate-400 mb-1">
                        <button onClick={() => navigate('/dashboard')} className="hover:underline">Dashboard</button>
                        <span className="px-2">/</span>
                        <button onClick={() => navigate('/dashboard/orders')} className="hover:underline">Orders</button>
                        <span className="px-2">/</span>
                        <span className="text-slate-600">#{order.id}</span>
                    </nav>

                    <h2 className="text-lg font-semibold">{order.subject}</h2>{/* smaller heading */}
                    <div className="text-xs text-slate-500">ID: #{order.id}</div>
                </div>

                <div className="text-right flex flex-col items-end gap-2">{/* compact actions */}
                    <div className="text-xs text-slate-500">Status</div>
                    <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>{order.status}</div>{/* smaller chip */}
                    <div className="text-sm mt-1">Budget: <span className="font-semibold">${order.price}</span></div>
                    {order.status === 'PENDING' && (
                        <button onClick={handlePay} className="mt-1 bg-blue-600 text-white py-1 px-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Pay Now</button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{/* reduced gap */}
                <div className="md:col-span-2">
                    <h3 className="font-semibold text-sm">Instructions</h3>
                    <p className="text-slate-700 mt-1 text-sm">{order.description || 'No description provided.'}</p>

                    <div className="mt-3">
                        <h4 className="font-semibold text-sm">Deadline</h4>
                        <div className="text-slate-600 mt-1 text-sm">{new Date(order.deadline).toLocaleString()}</div>
                    </div>

                    <div className="mt-3">
                        <h4 className="font-semibold text-sm">Attachments</h4>
                        <div className="mt-2">
                            {order.files && order.files.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{/* denser grid */}
                                    {order.files.map(f => (
                                        <div key={f.id} className="flex items-center gap-2 p-2 border rounded-md bg-slate-50">{/* smaller padding */}
                                            {renderFilePreviewCompact(f)}
                                            <div className="truncate">
                                                <a href={`/${f.url.split('/').pop()}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-medium truncate">{f.name}</a>
                                                <div className="text-xs text-slate-500">{humanFileType(f.name)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-slate-500 text-sm">No attachments</div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="p-3 border rounded-md bg-slate-50 text-sm">{/* smaller padding */}
                    <h4 className="font-semibold mb-2 text-sm">Meta</h4>
                    <div className="text-sm text-slate-600">Order ID: #{order.id}</div>
                    <div className="text-sm text-slate-600 mt-1">Posted: {/* optionally show relative time */}</div>

                    {order.expert && (
                        <div className="mt-3">
                            <h5 className="font-semibold text-sm">Assigned Expert</h5>
                            <div className="text-sm text-slate-700">{order.expert.email}</div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

// Small helpers
const getStatusStyle = (status: string) => {
    switch (status) {
        case 'PAID': return 'bg-green-100 text-green-700';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        case 'ASSIGNED': return 'bg-blue-100 text-blue-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const humanFileType = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return 'file';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    return ext;
};

const renderFilePreviewCompact = (file: FileItem) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) {
        const src = `/uploads/${file.url.split('/').pop()}`;
        return <img src={src} alt={file.name} className="w-12 h-10 object-cover rounded" />; /* smaller */
    }
    if (ext === 'pdf') {
        return (
            <div className="w-10 h-10 bg-red-50 flex items-center justify-center rounded-md">
                <svg className="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
            </div>
        );
    }

    return (
        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-md text-xs text-slate-600">{file.name.split('.').pop()}</div>
    );
};

export default OrderDetails;


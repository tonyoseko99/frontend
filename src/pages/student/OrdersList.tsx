import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

interface Order {
    id: number;
    subject: string;
    status: string;
    deadline: string;
    price: number;
    rating: number | null;
    expert?: { id?: number; email?: string } | null;
}

const OrdersList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const res = await apiClient.get('/student/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(globalThis.location.search);
        const status = params.get('status');
        const sessionId = params.get('session_id');

        const runVerifyAndRefresh = async () => {
            if (sessionId) {
                try {
                    await apiClient.get(`/payment/verify/${sessionId}`);
                } catch (err) {
                    console.warn('Could not verify session immediately', err);
                }
            }
            await fetchOrders();
            params.delete('status');
            params.delete('orderId');
            params.delete('session_id');
            const newSearch = params.toString();
            const newUrl = globalThis.location.pathname + (newSearch ? `?${newSearch}` : '');
            globalThis.history.replaceState({}, document.title, newUrl);
        };

        if (status === 'success' || sessionId) {
            runVerifyAndRefresh();
        } else {
            fetchOrders();
        }
    }, []);

    const handlePayment = async (orderId: number) => {
        try {
            const response = await apiClient.post('/payment/create-checkout-session', { orderId });
            const { url } = response.data;
            if (url) {
                globalThis.location.assign(url);
            } else {
                console.error("No checkout URL provided by the server");
                alert("Payment system error. Please try again later.");
            }
        } catch (err) {
            console.error("Payment Process Error:", err);
            alert("Could not initiate payment.");
        }
    };

    const handleViewDetails = (orderId: number) => {
        navigate(`/dashboard/orders/${orderId}`);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Your Academic Tasks</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Deadline</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order: Order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-medium text-slate-900">{order.subject}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status, order)}`}>
                                        {getStatusText(order.status, order)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{new Date(order.deadline).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-semibold">${order.price}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {order.status === 'PENDING' && (
                                            <button onClick={() => handlePayment(order.id)} className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700 transition">
                                                Pay Now
                                            </button>
                                        )}
                                        {order.status === 'REVIEW' && (
                                            <button onClick={() => handleViewDetails(order.id)} className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-green-700 transition">
                                                Review Solution
                                            </button>
                                        )}
                                        {order.status === 'COMPLETED' && !order.rating && (
                                            <button onClick={() => handleViewDetails(order.id)} className="bg-yellow-500 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-yellow-600 transition">
                                                Review
                                            </button>
                                        )}
                                        <button onClick={() => handleViewDetails(order.id)} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm font-bold hover:bg-slate-200 transition">
                                            View Details
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getStatusText = (status: string, order: Order) => {
    // For PAID status, check if expert is assigned
    if (status === 'PAID') {
        return order.expert ? 'AWAITING EXPERT' : 'FINDING EXPERT';
    }
    return status;
};

const getStatusStyle = (status: string, order?: Order) => {
    // For PAID status, differentiate based on expert assignment
    if (status === 'PAID') {
        return order?.expert ? 'bg-blue-100 text-blue-700' : 'bg-cyan-100 text-cyan-700';
    }

    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        case 'ASSIGNED': return 'bg-blue-100 text-blue-700';
        case 'IN_PROGRESS': return 'bg-indigo-100 text-indigo-700';
        case 'REVIEW': return 'bg-orange-100 text-orange-700';
        case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

export default OrdersList;

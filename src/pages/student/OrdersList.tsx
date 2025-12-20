import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
// import { FileText, Clock } from 'lucide-react';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient.get('/student/my-orders');
                setOrders(response.data);
            } catch (err) {
                console.error("Failed to load orders ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-8">Loading your tasks...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-600">Subject</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Deadline</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-4 font-medium text-slate-800">{order.subject}</td>
                        <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{new Date(order.deadline).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-slate-900">${order.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {orders.length === 0 && (
                <div className="p-12 text-center text-slate-400">No orders found. Start by posting a task!</div>
            )}
        </div>
    );
};

export default OrdersList;
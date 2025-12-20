import { useEffect, useState } from 'react';
import apiClient from '../../api/client';

interface Order {
    id: number;
    subject: string;
    status: string;
    deadline: string;
    price: number;
}

const OrdersList = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        apiClient.get('/student/orders').then(res => setOrders(res.data));
    }, []);

    const handlePayment = async (orderId: number) => {
        try {
            const response = await apiClient.post('/payment/create-checkout-session', { orderId });
            const { url } = response.data;

            // Use the checkout URL directly (modern approach)
            if (url) {
                window.location.assign(url);
                return;
            }

            // If no URL is provided, show an error
            console.error("No checkout URL provided by the server");
            alert("Payment system error. Please try again later.");
        } catch (err) {
            console.error("Payment Process Error:", err);
            alert("Could not initiate payment.");
        }
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                      {order.status === 'PENDING' ? (
                          <button
                              onClick={() => handlePayment(order.id)}
                              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-blue-700 transition"
                          >
                              Pay Now
                          </button>
                      ) : (
                          <button className="text-slate-400 cursor-not-allowed text-sm">View Details</button>
                      )}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{new Date(order.deadline).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-semibold">${order.price}</td>
                            <td className="px-6 py-4">
                                <button className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'PAID': return 'bg-green-100 text-green-700';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        case 'ASSIGNED': return 'bg-blue-100 text-blue-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

export default OrdersList;
import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { MessageSquare, Loader, AlertTriangle } from 'lucide-react';
import Chat from '../../components/Chat';

interface Order {
    id: number;
    subject: string;
    status: string;
    price: number;
    deadline: string;
}

const StudentMessages = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await apiClient.get('/student/orders');
                const ordersData = Array.isArray(res.data) ? res.data : res.data.data;
                // Only show orders that have an expert assigned (can message about them)
                const ordersWithExperts = ordersData.filter((order: Order) => order.status !== 'PENDING' && order.status !== 'PAID');
                setOrders(ordersWithExperts);
            } catch (err) {
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
                <AlertTriangle size={32} />
                <div>
                    <h3 className="font-bold text-lg">Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-200px)]">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Messages</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Orders List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-800">Your Orders</h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare size={40} className="mx-auto text-slate-400 mb-2" />
                                <p className="text-slate-500">No active orders</p>
                                <p className="text-xs text-slate-400 mt-1">Orders with assigned experts will appear here</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${selectedOrder?.id === order.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                        }`}
                                >
                                    <h3 className="font-semibold text-slate-800 truncate">{order.subject}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="px-2 py-1 bg-slate-100 rounded">{order.status}</span>
                                        <span>${order.price}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="md:col-span-2 overflow-hidden flex flex-col">
                    {selectedOrder ? (
                        <Chat orderId={selectedOrder.id.toString()} isLocked={selectedOrder.status === 'COMPLETED'} />
                    ) : (
                        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare size={60} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700">Select an order to start messaging</h3>
                                <p className="text-slate-500 mt-2">Choose an order from the list to chat with your expert</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentMessages;

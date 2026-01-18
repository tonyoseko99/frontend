import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { MessageSquare, Clock, DollarSign, Loader, AlertTriangle, Send, User } from 'lucide-react';

interface Order {
    id: number;
    subject: string;
    status: string;
    price: number;
    deadline: string;
}

interface Message {
    id: number;
    content: string;
    createdAt: string;
    sender: {
        id: number;
        email: string;
        role: string;
    };
}

const StudentMessages = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await apiClient.get('/student/orders');
                // Only show orders that have an expert assigned (can message about them)
                const ordersWithExperts = res.data.filter((order: Order) => order.status !== 'PENDING' && order.status !== 'PAID');
                setOrders(ordersWithExperts);
            } catch (err) {
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        if (!selectedOrder) return;

        const fetchMessages = async () => {
            try {
                const res = await apiClient.get(`/chat/${selectedOrder.id}`);
                setMessages(res.data);
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };

        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedOrder]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedOrder) return;

        setSending(true);
        try {
            await apiClient.post('/chat', {
                orderId: selectedOrder.id,
                content: newMessage
            });
            setNewMessage('');
            // Refresh messages
            const res = await apiClient.get(`/chat/${selectedOrder.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

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
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h2 className="font-bold text-slate-800">Your Orders</h2>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-60px)]">
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
                <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    {selectedOrder ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-bold text-slate-800">{selectedOrder.subject}</h2>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedOrder.deadline).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><DollarSign size={14} /> ${selectedOrder.price}</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare size={40} className="mx-auto text-slate-400 mb-2" />
                                        <p className="text-slate-500">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isStudent = msg.sender.role === 'STUDENT';
                                        return (
                                            <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] ${isStudent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'} rounded-2xl px-4 py-2`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={14} />
                                                        <span className="text-xs opacity-75">{msg.sender.role === 'STUDENT' ? 'You' : 'Expert'}</span>
                                                    </div>
                                                    <p>{msg.content}</p>
                                                    <span className="text-xs opacity-75 mt-1 block">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition"
                                    >
                                        <Send size={18} />
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
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

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { Send, Loader } from 'lucide-react';

interface Message {
    id: number;
    content: string;
    sender: {
        id: number;
        email: string;
        role: string;
    };
    createdAt: string;
}

interface ChatProps {
    orderId: string;
    isLocked?: boolean;
}

const Chat = ({ orderId, isLocked }: ChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { user } = useAuth();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await apiClient.get(`/chat/${orderId}/messages`);
                setMessages(res.data);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [orderId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_order_room', orderId);

        socket.on('receive_message', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit('leave_order_room', orderId);
            socket.off('receive_message');
        };
    }, [socket, orderId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!socket || !newMessage.trim() || !user) return;

        socket.emit('send_message', {
            orderId,
            senderId: user.id,
            content: newMessage,
        });

        setNewMessage('');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-blue-600" size={48} /></div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Order Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender.id === user?.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                            <p className="text-sm font-bold">{msg.sender.email}</p>
                            <p>{msg.content}</p>
                            <p className="text-xs opacity-75 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200">
                {isLocked ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-dashed border-slate-300 text-center">
                        <p className="text-slate-500 text-sm font-medium italic">
                            This order is completed and the chat is now closed.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 rounded-full border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Chat;

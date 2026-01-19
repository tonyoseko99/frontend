import { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface Notification {
    id: number;
    type: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { socket } = useSocket();
    const { user } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await apiClient.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        if (!socket || !user) return;

        // Join personal room
        socket.emit('join_user_room', user.id);

        // Listen for new notifications
        socket.on('new_notification', (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
        });

        return () => {
            socket.off('new_notification');
        };
    }, [socket, user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await apiClient.patch(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await apiClient.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all relative group"
            >
                <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-slate-900 shadow-lg shadow-blue-500/20">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-slate-800 hover:bg-white/5 transition group relative ${!notification.isRead ? 'bg-blue-500/5' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`mt-1 p-2 rounded-lg ${!notification.isRead ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {!notification.isRead ? <Bell size={14} /> : <Check size={14} />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-white font-semibold' : 'text-slate-400 font-medium'}`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                                {notification.link && (
                                                    <Link
                                                        to={notification.link}
                                                        onClick={() => {
                                                            markAsRead(notification.id);
                                                            setIsOpen(false);
                                                        }}
                                                        className="text-[10px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest flex items-center gap-1"
                                                    >
                                                        View <ExternalLink size={10} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-blue-400 transition"
                                                title="Mark as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center space-y-3">
                                <div className="p-4 bg-slate-800/50 rounded-full w-fit mx-auto text-slate-600">
                                    <Bell size={32} />
                                </div>
                                <p className="text-slate-500 text-sm font-medium">All caught up! No new notifications.</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-slate-800/30 text-center">
                            <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition">
                                Clear History
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;

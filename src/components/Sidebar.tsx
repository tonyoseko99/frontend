import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    MessageSquare,
    User,
    LogOut,
    Briefcase,
    FileText,
    Users,
    Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number; className?: string }>;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Paradigm: Active State Highlighting
    // This helper function determines if the current route matches the link
    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Role-aware navigation
    const navItems = user?.role === 'ADMIN'
        ? [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
            { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
            { name: 'Profile', path: '/admin/profile', icon: User },
        ]
        : user?.role === 'EXPERT'
            ? [
                { name: 'Dashboard', path: '/expert', icon: LayoutDashboard },
                { name: 'Jobs', path: '/expert/jobs', icon: Briefcase },
                { name: 'My Jobs', path: '/expert/my-jobs', icon: Briefcase },
                { name: 'Submissions', path: '/expert/submissions', icon: FileText },
                { name: 'Messages', path: '/expert/messages', icon: MessageSquare },
                { name: 'Reviews', path: '/expert/reviews', icon: Star },
                { name: 'Profile', path: '/expert/profile', icon: User },
            ]
            : [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                { name: 'New Order', path: '/dashboard/create-order', icon: PlusCircle },
                { name: 'My Orders', path: '/dashboard/orders', icon: ClipboardList },
                { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
                { name: 'Profile', path: '/dashboard/profile', icon: User },
            ];

    return (
        <div className="flex flex-col w-64 bg-slate-900 h-screen sticky top-0 text-slate-300">
            {/* Brand Logo Section */}
            <div className="p-6">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-blue-600 p-1.5 rounded-lg text-white">PA</span>
                    <span className="ml-2">ProAcademic</span>
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path)
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {React.createElement(item.icon as IconType, { size: 20 })}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, User } from 'lucide-react';

const Layout = () => {
    const { user } = useAuth();

    return (
        <div className="flex bg-[#f8fafc] min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {/* TopBar */}
                <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
                            {user?.role} Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />

                        <div className="h-10 w-[1px] bg-slate-200"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                                <User size={20} />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">{user?.email?.split('@')[0] || 'User'}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    Verified Profile <ChevronDown size={10} />
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {/* This is where your DashboardHome or OrdersList will appear */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
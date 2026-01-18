import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const AdminLayout = () => {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

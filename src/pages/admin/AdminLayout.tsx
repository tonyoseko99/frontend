import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import DashboardTopBar from '../../components/DashboardTopBar';

const AdminLayout = () => {
    return (
        <div className="flex bg-[#f8fafc] min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardTopBar />
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

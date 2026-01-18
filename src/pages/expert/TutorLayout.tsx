import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const TutorLayout = () => {
    return (
        <div className="flex bg-indigo-50/30 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default TutorLayout;
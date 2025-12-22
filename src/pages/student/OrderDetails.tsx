import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

interface FileItem {
    id: number;
    url: string;
    name: string;
}

interface Order {
    id: number;
    subject: string;
    description?: string | null;
    status: string;
    deadline: string;
    price: number;
    files?: FileItem[];
}

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        apiClient.get(`/student/orders/${id}`)
            .then(res => setOrder(res.data))
            .catch(err => {
                console.error('Failed to fetch order:', err);
                alert('Could not load order details');
                navigate('/dashboard/orders');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!order) return <div className="p-6">Order not found</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-bold mb-2">{order.subject}</h2>
            <div className="text-sm text-slate-500 mb-4">Status: <strong>{order.status}</strong></div>
            <div className="mb-4">Deadline: {new Date(order.deadline).toLocaleString()}</div>
            <div className="mb-4">Budget: ${order.price}</div>

            <div className="mb-4">
                <h3 className="font-semibold mb-2">Instructions</h3>
                <p className="text-slate-700">{order.description || 'No description provided.'}</p>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Attachments</h3>
                {order.files && order.files.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {order.files.map((f) => (
                            <li key={f.id}><a href={`/${f.url}`} target="_blank" rel="noreferrer" className="text-blue-600">{f.name}</a></li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-slate-500">No attachments</div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;


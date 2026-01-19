import React from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'warning' | 'info' | 'success';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const typeConfig = {
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            icon: <AlertTriangle className="text-amber-600" size={32} />,
            btn: 'bg-slate-900 hover:bg-black',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            icon: <Info className="text-blue-600" size={32} />,
            btn: 'bg-blue-600 hover:bg-blue-700',
        },
        success: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            icon: <CheckCircle className="text-emerald-600" size={32} />,
            btn: 'bg-emerald-600 hover:bg-emerald-700',
        }
    };

    const config = typeConfig[type];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className={`p-8 ${config.bg} border-b ${config.border} relative`}>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                            {config.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors border-2 border-slate-100"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${config.btn}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

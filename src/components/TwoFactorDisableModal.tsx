import { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../api/client';

interface TwoFactorDisableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TwoFactorDisableModal = ({ isOpen, onClose, onSuccess }: TwoFactorDisableModalProps) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (verificationCode.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/2fa/disable', {
                token: verificationCode
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to disable 2FA');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setVerificationCode('');
            setError('');
            setSuccess(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Shield className="text-white" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Disable Two-Factor Authentication</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-white/80 hover:text-white transition disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">2FA Disabled</h3>
                            <p className="text-slate-600 text-center">
                                Two-factor authentication has been disabled for your account.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleDisable} className="space-y-4">
                            {/* Warning */}
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="text-orange-600 flex-shrink-0" size={20} />
                                <div>
                                    <h3 className="font-semibold text-orange-900 mb-1">Security Warning</h3>
                                    <p className="text-sm text-orange-800">
                                        Disabling 2FA will make your account less secure. You can re-enable it anytime.
                                    </p>
                                </div>
                            </div>

                            {/* Verification */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Enter your current 2FA code to confirm
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-center text-2xl font-mono tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                    disabled={loading}
                                    autoFocus
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Open your authenticator app to get the code
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle className="text-red-600" size={20} />
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || verificationCode.length !== 6}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Disabling...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={18} />
                                            Disable 2FA
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorDisableModal;

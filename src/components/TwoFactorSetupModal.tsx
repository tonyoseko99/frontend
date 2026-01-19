import { useState, useEffect } from 'react';
import { X, Shield, Copy, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import apiClient from '../api/client';

interface TwoFactorSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TwoFactorSetupModal = ({ isOpen, onClose, onSuccess }: TwoFactorSetupModalProps) => {
    const [step, setStep] = useState<'loading' | 'scan' | 'verify' | 'success'>('loading');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [hasSetup, setHasSetup] = useState(false);

    useEffect(() => {
        if (isOpen && !hasSetup) {
            setupTwoFactor();
        }
    }, [isOpen, hasSetup]);

    const setupTwoFactor = async () => {
        try {
            setStep('loading');
            const response = await apiClient.post('/auth/2fa/setup');
            setQrCode(response.data.qrCode);
            setSecret(response.data.secret);
            setHasSetup(true);
            setStep('scan');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to setup 2FA');
            setStep('scan');
        }
    };

    const handleCopySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (verificationCode.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        try {
            await apiClient.post('/auth/2fa/verify', {
                secret,
                token: verificationCode
            });

            setStep('success');
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid verification code');
        }
    };

    const handleClose = () => {
        setStep('loading');
        setQrCode('');
        setSecret('');
        setVerificationCode('');
        setError('');
        setCopied(false);
        setHasSetup(false); // Reset so new QR code is generated next time
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Shield className="text-white" size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Enable Two-Factor Authentication</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={step === 'loading'}
                        className="text-white/80 hover:text-white transition disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-slate-600">Setting up 2FA...</p>
                        </div>
                    )}

                    {step === 'scan' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <Smartphone size={18} />
                                    Step 1: Scan QR Code
                                </h3>
                                <p className="text-sm text-blue-800">
                                    Use Google Authenticator, Authy, or any TOTP app to scan this QR code:
                                </p>
                            </div>

                            {/* QR Code */}
                            {qrCode && (
                                <div className="flex justify-center bg-white p-4 rounded-xl border-2 border-slate-200">
                                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                                </div>
                            )}

                            {/* Manual Entry */}
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs text-slate-600 mb-2 font-medium">Can't scan? Enter this code manually:</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono break-all">
                                        {secret}
                                    </code>
                                    <button
                                        onClick={handleCopySecret}
                                        className="p-2 hover:bg-slate-200 rounded-lg transition"
                                        title="Copy secret"
                                    >
                                        {copied ? (
                                            <CheckCircle className="text-green-600" size={20} />
                                        ) : (
                                            <Copy className="text-slate-600" size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Verification Form */}
                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                    <h3 className="font-semibold text-indigo-900 mb-2">Step 2: Verify</h3>
                                    <p className="text-sm text-indigo-800 mb-3">
                                        Enter the 6-digit code from your authenticator app:
                                    </p>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-center text-2xl font-mono tracking-widest"
                                        placeholder="000000"
                                        maxLength={6}
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                        <AlertCircle className="text-red-600" size={20} />
                                        <p className="text-red-800 text-sm">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={verificationCode.length !== 6}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Shield size={18} />
                                    Enable 2FA
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">2FA Enabled!</h3>
                            <p className="text-slate-600 text-center">
                                Your account is now protected with two-factor authentication.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorSetupModal;

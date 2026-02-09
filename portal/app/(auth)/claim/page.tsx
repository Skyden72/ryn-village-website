
'use client'

import { useState } from 'react'
import { Loader2, ArrowRight, Lock, Phone } from 'lucide-react'
import { sendClaimOTP, verifyAndClaimProfile } from './actions'
import { useRouter } from 'next/navigation'

export default function ClaimProfilePage() {
    // Steps: 'identify' -> 'verify' -> 'success'
    const [step, setStep] = useState<'identify' | 'verify'>('identify')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [maskedPhone, setMaskedPhone] = useState('')

    const router = useRouter()

    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await sendClaimOTP(email)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        if (result.maskedPhone) {
            setMaskedPhone(result.maskedPhone)
            setStep('verify')
        }
        setLoading(false)
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const result = await verifyAndClaimProfile(email, otp, password)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        // Success - Redirect to dashboard
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">
                        Claim Your Profile
                    </h1>
                    <p className="text-slate-400">
                        {step === 'identify'
                            ? 'Enter your email to verify your identity'
                            : 'Enter the code sent to your phone'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {step === 'identify' ? (
                    <form onSubmit={handleIdentify} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <>
                                    Verify Identity
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-400" />
                            <p className="text-sm text-blue-200">
                                Code sent to {maskedPhone}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                SMS Verification Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-center tracking-[0.5em] text-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Set New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Complete Registration'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('identify')}
                            className="w-full text-sm text-slate-400 hover:text-white mt-2"
                        >
                            Back only verify email
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

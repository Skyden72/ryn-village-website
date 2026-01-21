'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="Ryn Village"
                        className="h-16 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-serif font-bold text-slate-800">
                        Resident Portal
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Access your bills, announcements, and more
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {sent ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                Check your email
                            </h2>
                            <p className="text-slate-600">
                                We sent a login link to <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-slate-500 mt-4">
                                Click the link in your email to sign in. No password needed!
                            </p>
                            <button
                                onClick={() => setSent(false)}
                                className="mt-6 text-amber-600 hover:text-amber-700 font-medium"
                            >
                                Try a different email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                                />
                            </div>

                            {error && (
                                <p className="mt-3 text-sm text-red-600">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Login Link'
                                )}
                            </button>

                            <p className="mt-4 text-center text-sm text-slate-500">
                                We&apos;ll email you a magic link to sign in instantly.
                            </p>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-8">
                    Need help? Contact the office at{' '}
                    <a href="tel:+27123456789" className="text-amber-600 hover:underline">
                        (012) 345-6789
                    </a>
                </p>
            </div>
        </div>
    )
}

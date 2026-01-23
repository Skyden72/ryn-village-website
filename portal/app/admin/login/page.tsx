'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Shield } from 'lucide-react'
import Image from 'next/image'
import { adminLogin } from './actions'

export default function AdminLoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await adminLogin(formData)

            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
                return
            }

            if (result?.success) {
                router.push('/admin')
            }
        } catch (e: any) {
            console.error('Admin login error:', e)
            setError(e.message || 'An unexpected error occurred')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-white">
                        Staff Portal
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Authorized personnel only
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                    <form action={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="staff@rynvillage.co.za"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-500"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    Not a staff member?{' '}
                    <a href="/login" className="text-amber-500 hover:text-amber-400">
                        Resident Login
                    </a>
                </p>
            </div>
        </div>
    )
}

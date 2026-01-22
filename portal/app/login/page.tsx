'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, signup } from './actions'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [view, setView] = useState<'login' | 'signup'>('login')
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        try {
            const action = view === 'login' ? login : signup
            const result = await action(formData)

            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
            } else if (result?.success) {
                // Keep loading state true while redirecting to prevent UI flash
                router.push('/dashboard')
            } else {
                setIsLoading(false)
            }

        } catch (e: any) {
            console.error('Login error:', e)
            setError(e.message || 'An unexpected error occurred')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column - Hero Image */}
            <div className="relative hidden lg:block h-full">
                <Image
                    src="/images/login-hero.jpg"
                    alt="Ryn Village Lifestyle"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 p-12 text-white">
                    <h2 className="text-4xl font-serif font-bold mb-4">Welcome Home</h2>
                    <p className="text-lg text-slate-100 max-w-md">
                        Access your resident portal to manage your home, view announcements, and connect with your community.
                    </p>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 bg-slate-50">
                <div className="w-full max-w-md mx-auto">
                    {/* Logo */}
                    <div className="mb-12">
                        <Image
                            src="/logo.png"
                            alt="Ryn Village"
                            width={300}
                            height={80}
                            className="h-20 w-auto object-contain"
                            priority
                        />
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                            {view === 'login' ? 'Resident Login' : 'Create Account'}
                        </h1>
                        <p className="text-slate-600">
                            {view === 'login'
                                ? 'Enter your details to access your portal'
                                : 'Sign up for a new resident account'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <div className="text-red-500 mt-0.5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-sm text-red-600">
                                <p className="font-medium">Authentication Failed</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>{view === 'login' ? 'Sign In' : 'Create Account'}</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center sm:text-left">
                        <div className="text-sm text-slate-600">
                            {view === 'login' ? (
                                <p>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setView('signup')}
                                        className="text-amber-600 hover:text-amber-700 font-medium"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setView('login')}
                                        className="text-amber-600 hover:text-amber-700 font-medium"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

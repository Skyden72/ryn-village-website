'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewAnnouncementPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        content: '',
        priority: 'normal',
        isPublished: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // TODO: Submit to Supabase
        await new Promise(resolve => setTimeout(resolve, 1000))

        router.push('/admin/announcements')
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/admin/announcements"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to announcements
            </Link>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h1 className="text-2xl font-serif font-bold text-white mb-6">
                    New Announcement
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Announcement title"
                            required
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Content *
                        </label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="Write your announcement here..."
                            required
                            rows={8}
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Priority
                        </label>
                        <div className="flex gap-4">
                            {['low', 'normal', 'urgent'].map((p) => (
                                <label key={p} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={form.priority === p}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                        className="w-4 h-4 text-amber-500 focus:ring-amber-500 bg-slate-700 border-slate-600"
                                    />
                                    <span className={`capitalize ${p === 'urgent' ? 'text-red-400' : 'text-slate-300'
                                        }`}>{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Publish */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.isPublished}
                                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                                className="w-5 h-5 text-amber-500 focus:ring-amber-500 bg-slate-700 border-slate-600 rounded"
                            />
                            <span className="text-slate-300">Publish immediately</span>
                        </label>
                        <p className="text-xs text-slate-500 mt-1 ml-8">
                            Uncheck to save as draft
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                form.isPublished ? 'Publish Announcement' : 'Save Draft'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

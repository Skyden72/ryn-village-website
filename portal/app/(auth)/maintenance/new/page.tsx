'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { submitMaintenanceRequest } from '../actions'

const categories = [
    'Plumbing',
    'Electrical',
    'General Maintenance',
    'HVAC / Air Conditioning',
    'Security',
    'Landscaping',
    'Other',
]

export default function NewMaintenancePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        category: '',
        description: '',
        priority: 'normal',
    })

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)

        // Append form state to FormData if not using native form action
        // Actually, we can use the server action directly in the form 'action' prop, 
        // but we want to show loading state. 
        // Let's wrap it.

        try {
            const result = await submitMaintenanceRequest(formData)

            if (result?.error) {
                alert(result.error) // Simple alert for now, could be better UI
                setLoading(false)
                return
            }

            // Success
            router.push('/maintenance')
        } catch (e) {
            console.error(e)
            alert('Something went wrong')
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Link */}
            <Link
                href="/maintenance"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to requests
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h1 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                    New Maintenance Request
                </h1>

                <form action={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            What needs attention? *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="e.g., Leaking tap in kitchen"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800 bg-white"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Describe the issue
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Please provide as much detail as possible..."
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800 resize-none"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Priority
                        </label>
                        <div className="flex gap-4">
                            {['normal', 'urgent'].map((p) => (
                                <label key={p} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={form.priority === p}
                                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="text-slate-700 capitalize">{p}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Only select &quot;Urgent&quot; for emergencies requiring immediate attention
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Request'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

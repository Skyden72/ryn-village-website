import { useState } from 'react'
import { User, Phone, Home, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { updateProfile } from './actions'

interface ProfileFormProps {
    initialData: {
        full_name: string
        email: string
        phone: string | null
        unit_number: string
        emergency_contact: string | null
        emergency_phone: string | null
    }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setSaved(false)
        setError(null)

        try {
            const result = await updateProfile(formData)

            if (result?.error) {
                setError(result.error)
            } else {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            }
        } catch (e) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-800">
                    My Profile
                </h1>
                <p className="text-slate-600 mt-1">
                    Manage your contact information
                </p>
            </div>

            <form action={handleSubmit}>
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-400" />
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={initialData.full_name}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Unit Number
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="unitNumber"
                                    defaultValue={initialData.unit_number}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={initialData.email}
                                disabled
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 mt-1">Contact office to change email</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={initialData.phone || ''}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        Emergency Contact
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                name="emergencyContact"
                                defaultValue={initialData.emergency_contact || ''}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Contact Phone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="emergencyPhone"
                                    defaultValue={initialData.emergency_phone || ''}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Saved!
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </form>
        </div>
    )
}

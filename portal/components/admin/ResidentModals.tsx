'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { addResident, updateResident } from '@/lib/actions/residents'

type Resident = {
    id: string
    full_name: string
    unit_number: string
    email: string
    phone: string
    is_active: boolean
}

interface ModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddResidentModal({ isOpen, onClose }: ModalProps) {
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            const result = await addResident(formData)
            if (result.error) {
                alert(result.error)
            } else {
                onClose()
            }
        } catch (error) {
            console.error(error)
            alert('Failed to add resident')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-xl font-bold text-white">Add New Resident</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <input name="fullName" required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Unit Number</label>
                            <input name="unitNumber" required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Unit 42" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                            <input name="phone" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="082 123 4567" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <input name="email" type="email" required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Resident
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface EditModalProps extends ModalProps {
    resident: Resident | null
}

export function EditResidentModal({ isOpen, onClose, resident }: EditModalProps) {
    const [loading, setLoading] = useState(false)

    if (!isOpen || !resident) return null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            const result = await updateResident(resident!.id, formData)
            if (result.error) {
                alert(result.error)
            } else {
                onClose()
            }
        } catch (error) {
            console.error(error)
            alert('Failed to update resident')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                    <h3 className="text-xl font-bold text-white">Edit Resident</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <input name="fullName" defaultValue={resident.full_name} required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Unit Number</label>
                            <input name="unitNumber" defaultValue={resident.unit_number} required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                            <input name="phone" defaultValue={resident.phone} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <input name="email" type="email" defaultValue={resident.email} required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                        </div>

                        <div className="col-span-2 flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                id="isActive"
                                defaultChecked={resident.is_active}
                                className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-slate-300">Account Active</label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

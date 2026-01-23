'use client'

import { useState } from 'react'
import { Users, Plus, Search, Mail, Phone, Home, Trash2, Edit, Loader2 } from 'lucide-react'
import { AddResidentModal, EditResidentModal } from './ResidentModals'
import { deleteResident } from '@/lib/actions/residents'

type Resident = {
    id: string
    full_name: string
    unit_number: string
    email: string
    phone: string
    is_active: boolean
}

export default function ResidentsTable({ initialResidents }: { initialResidents: Resident[] }) {
    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingResident, setEditingResident] = useState<Resident | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const filtered = initialResidents.filter(r =>
        r.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (r.unit_number && r.unit_number.toLowerCase().includes(search.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(search.toLowerCase()))
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resident? This action cannot be undone.')) return

        try {
            setDeletingId(id)
            await deleteResident(id)
        } catch (error) {
            console.error(error)
            alert('Failed to delete resident')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white">
                        Residents
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage resident accounts
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Resident
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, unit, or email..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Residents Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-900/50">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Resident</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filtered.map((resident) => (
                                <tr key={resident.id} className="hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{resident.full_name}</p>
                                                <p className="text-sm text-slate-400">{resident.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300 font-mono">
                                            <Home className="w-4 h-4 text-slate-500" />
                                            {resident.unit_number}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Phone className="w-4 h-4 text-slate-500" />
                                            {resident.phone || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${resident.is_active
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-slate-600/20 text-slate-400 border-slate-600/30'
                                            }`}>
                                            {resident.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => window.location.href = `mailto:${resident.email}`}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                                                title="Email Resident"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setEditingResident(resident)}
                                                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 rounded-lg transition-colors"
                                                title="Edit Details"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resident.id)}
                                                disabled={deletingId === resident.id}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Resident"
                                            >
                                                {deletingId === resident.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-white font-medium mb-1">No residents found</h3>
                            <p className="text-slate-400 text-sm">
                                Try adjusting your search or add a new resident.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AddResidentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            <EditResidentModal
                isOpen={!!editingResident}
                onClose={() => setEditingResident(null)}
                resident={editingResident}
            />
        </div>
    )
}

'use client'

import { useState } from 'react'
import { Users, Plus, Search, MoreVertical, Mail, Phone, Home, Trash2, Edit } from 'lucide-react'

// TODO: Fetch from Supabase
const initialResidents = [
    { id: '1', fullName: 'John Smith', email: 'john.smith@email.com', unitNumber: 'A12', phone: '082 123 4567', isActive: true },
    { id: '2', fullName: 'Mary Johnson', email: 'mary.j@email.com', unitNumber: 'A15', phone: '083 234 5678', isActive: true },
    { id: '3', fullName: 'Peter Williams', email: 'peter.w@email.com', unitNumber: 'B7', phone: '084 345 6789', isActive: true },
    { id: '4', fullName: 'Susan Brown', email: 'susan.b@email.com', unitNumber: 'B12', phone: '085 456 7890', isActive: false },
    { id: '5', fullName: 'David Miller', email: 'david.m@email.com', unitNumber: 'C3', phone: '086 567 8901', isActive: true },
]

export default function AdminResidentsPage() {
    const [residents] = useState(initialResidents)
    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)

    const filtered = residents.filter(r =>
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto">
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Residents Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Resident</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Unit</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Contact</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filtered.map((resident) => (
                            <tr key={resident.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{resident.fullName}</p>
                                            <p className="text-sm text-slate-400">{resident.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Home className="w-4 h-4 text-slate-500" />
                                        {resident.unitNumber}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        {resident.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${resident.isActive
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-slate-600/50 text-slate-400'
                                        }`}>
                                        {resident.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No residents found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { Receipt, Upload, Download, CheckCircle, Clock, Search } from 'lucide-react'

// TODO: Fetch from Supabase
const initialBills = [
    { id: '1', resident: 'John Smith', unit: 'A12', month: 'January 2026', amount: 2450.00, isPaid: false },
    { id: '2', resident: 'Mary Johnson', unit: 'A15', month: 'January 2026', amount: 2380.00, isPaid: true },
    { id: '3', resident: 'Peter Williams', unit: 'B7', month: 'January 2026', amount: 2520.00, isPaid: false },
    { id: '4', resident: 'Susan Brown', unit: 'B12', month: 'January 2026', amount: 2380.00, isPaid: true },
    { id: '5', resident: 'David Miller', unit: 'C3', month: 'January 2026', amount: 2450.00, isPaid: false },
]

export default function AdminBillsPage() {
    const [bills] = useState(initialBills)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all')

    const filtered = bills.filter(b => {
        const matchesSearch = b.resident.toLowerCase().includes(search.toLowerCase()) ||
            b.unit.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' ||
            (filter === 'paid' && b.isPaid) ||
            (filter === 'unpaid' && !b.isPaid)
        return matchesSearch && matchesFilter
    })

    const totalUnpaid = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0)

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white">
                        Bills Management
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Upload and manage resident bills
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg transition-all">
                    <Upload className="w-5 h-5" />
                    Upload Bills
                </button>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-slate-400">Total Outstanding</p>
                        <p className="text-2xl font-bold text-amber-400">
                            R {totalUnpaid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Unpaid Bills</p>
                        <p className="text-2xl font-bold text-white">
                            {bills.filter(b => !b.isPaid).length}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Paid Bills</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            {bills.filter(b => b.isPaid).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by resident or unit..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'unpaid', 'paid'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === f
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bills Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Resident</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Month</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Amount</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filtered.map((bill) => (
                            <tr key={bill.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-white">{bill.resident}</p>
                                        <p className="text-sm text-slate-400">Unit {bill.unit}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">{bill.month}</td>
                                <td className="px-6 py-4 text-white font-medium">
                                    R {bill.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bill.isPaid
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                        {bill.isPaid ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                        {bill.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        {!bill.isPaid && (
                                            <button className="px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition-colors">
                                                Mark Paid
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No bills found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { CheckCircle, Clock, Download, Receipt, Search, Loader2, FileText } from 'lucide-react'
import { toggleBillStatus, getBillDownloadUrl } from '@/lib/actions/bills'
import { format } from 'date-fns'
import PdfPreviewModal from './PdfPreviewModal'

type BillWithResident = {
    id: string
    created_at: string
    month: string
    amount: number
    is_paid: boolean
    paid_at: string | null
    pdf_url: string | null
    page_number: number | null
    invoice_number: string | null
    residents: {
        full_name: string
        unit_number: string
    } | null
}

export default function BillsTable({ bills }: { bills: BillWithResident[] }) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewTitle, setPreviewTitle] = useState('')

    const filtered = bills.filter(b => {
        const residentName = b.residents?.full_name || 'Unknown'
        const unitNumber = b.residents?.unit_number || 'Unknown'

        const matchesSearch = residentName.toLowerCase().includes(search.toLowerCase()) ||
            unitNumber.toLowerCase().includes(search.toLowerCase()) ||
            (b.invoice_number && b.invoice_number.toLowerCase().includes(search.toLowerCase()))

        const matchesFilter = filter === 'all' ||
            (filter === 'paid' && b.is_paid) ||
            (filter === 'unpaid' && !b.is_paid)

        return matchesSearch && matchesFilter
    })

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setLoadingId(id)
            await toggleBillStatus(id, !currentStatus)
        } catch (error) {
            console.error(error)
            alert('Failed to update status')
        } finally {
            setLoadingId(null)
        }
    }

    const handleDownload = async (path: string | null, pageNumber: number | null, id: string, title: string) => {
        if (!path) return
        try {
            setDownloadingId(id)
            const url = await getBillDownloadUrl(path, pageNumber ?? undefined)
            setPreviewUrl(url)
            setPreviewTitle(title)
        } catch (error) {
            console.error(error)
            alert('Failed to load bill preview')
        } finally {
            setDownloadingId(null)
        }
    }

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by resident, unit, or invoice #..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700 h-fit">
                    {(['all', 'unpaid', 'paid'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md font-medium capitalize transition-all text-sm ${filter === f
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-900/50">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Resident</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filtered.map((bill) => (
                                <tr key={bill.id} className="hover:bg-slate-700/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-white flex items-center gap-2">
                                                {bill.residents?.full_name || 'Unknown Resident'}
                                            </div>
                                            <div className="text-sm text-amber-500 font-mono mt-0.5">
                                                {bill.residents?.unit_number || 'No Unit'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">
                                            {format(new Date(bill.month), 'MMMM yyyy')}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                                            {bill.invoice_number}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">
                                            R {bill.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(bill.id, bill.is_paid)}
                                            disabled={loadingId === bill.id}
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${bill.is_paid
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                                } ${loadingId === bill.id ? 'opacity-70 cursor-wait' : ''}`}
                                        >
                                            {loadingId === bill.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : bill.is_paid ? (
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            ) : (
                                                <Clock className="w-3.5 h-3.5" />
                                            )}
                                            {bill.is_paid ? 'Paid' : 'Pending'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {bill.pdf_url && (
                                                <button
                                                    onClick={() => handleDownload(bill.pdf_url, bill.page_number, bill.id, bill.residents?.full_name || 'Bill')}
                                                    disabled={downloadingId === bill.id}
                                                    title="View Invoice PDF"
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                                                >
                                                    {downloadingId === bill.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-white font-medium mb-1">No bills found</h3>
                            <p className="text-slate-400 text-sm">
                                Try adjusting your filters or upload new invoices.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <PdfPreviewModal
                isOpen={!!previewUrl}
                onClose={() => setPreviewUrl(null)}
                url={previewUrl}
                title={previewTitle}
            />
        </div>
    )
}

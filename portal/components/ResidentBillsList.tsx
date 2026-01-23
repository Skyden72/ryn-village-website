'use client'

import { Receipt, Download, CheckCircle, Clock, Loader2, FileText, Eye } from 'lucide-react'
import { useState } from 'react'
import { getBillDownloadUrl } from '@/lib/actions/bills'
import PdfPreviewModal from '@/components/admin/PdfPreviewModal'
import { format } from 'date-fns'

interface Bill {
    id: string
    month: string
    amount: number
    is_paid: boolean
    pdf_url: string | null
    page_number: number | null
    invoice_number: string | null
}

export default function ResidentBillsList({ bills }: { bills: Bill[] }) {
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [previewTitle, setPreviewTitle] = useState('')

    const handleView = async (path: string | null, pageNumber: number | null, id: string, title: string) => {
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

    if (bills.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-bold mb-1">No bills found</h3>
                <p className="text-slate-500 text-sm">You're all caught up! No statements available yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Statement History</h2>
            </div>
            <div className="divide-y divide-slate-100">
                {bills.map((bill) => (
                    <div
                        key={bill.id}
                        className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bill.is_paid ? 'bg-emerald-50' : 'bg-amber-50'
                                }`}>
                                <FileText className={`w-6 h-6 ${bill.is_paid ? 'text-emerald-600' : 'text-amber-600'}`} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{format(new Date(bill.month), 'MMMM yyyy')}</p>
                                <p className="text-xs text-slate-500 font-mono">{bill.invoice_number}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="font-bold text-slate-900">
                                    R {bill.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-center justify-end gap-1.5 mt-1">
                                    {bill.is_paid ? (
                                        <>
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Paid</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleView(bill.pdf_url, bill.page_number, bill.id, `${format(new Date(bill.month), 'MMMM yyyy')} Statement`)}
                                disabled={downloadingId === bill.id}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all text-sm group"
                            >
                                {downloadingId === bill.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                )}
                                View
                            </button>
                        </div>
                    </div>
                ))}
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

'use client'

import { useActionState, useState } from 'react'
import { uploadInvoices, UploadResult } from '@/lib/actions/invoices'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const initialState: UploadResult = {
    success: false,
    message: ''
}

export default function InvoiceUploadPage() {
    const [state, formAction, isPending] = useActionState(uploadInvoices, initialState)
    const [filename, setFilename] = useState<string | null>(null)

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-white">Import Invoices</h1>
                <p className="text-slate-400 mt-1">Upload bulk PDF to parse and distribute bills</p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
                <form action={formAction} className="flex flex-col gap-6">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center hover:border-blue-500 transition-colors bg-slate-800/50">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <label className="block">
                            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block font-medium">
                                {filename || 'Select PDF File'}
                            </span>
                            <input
                                type="file"
                                name="file"
                                accept=".pdf"
                                required
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) setFilename(file.name)
                                }}
                            />
                        </label>
                        <p className="text-slate-500 mt-4 text-sm">Supported formats: PDF (Bulk Export)</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    Start Import
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            {state?.message && (
                <div className={`mt-8 rounded-xl p-6 border ${state.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-start gap-4">
                        {state.success ? (
                            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${state.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                {state.message}
                            </h3>

                            {state.stats && (
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-white">{state.stats.total}</div>
                                        <div className="text-xs text-slate-400">Total</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-emerald-400">{state.stats.processed}</div>
                                        <div className="text-xs text-slate-400">Processed</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-red-400">{state.stats.failed}</div>
                                        <div className="text-xs text-slate-400">Failed</div>
                                    </div>
                                </div>
                            )}

                            {state.stats?.errors && state.stats.errors.length > 0 && (
                                <div className="mt-4 bg-black/20 rounded-lg p-4 overflow-y-auto max-h-60">
                                    <p className="text-sm font-medium text-slate-300 mb-2">Error Log:</p>
                                    <ul className="space-y-1">
                                        {state.stats.errors.map((err, i) => (
                                            <li key={i} className="text-xs text-red-300 font-mono">
                                                • {err}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

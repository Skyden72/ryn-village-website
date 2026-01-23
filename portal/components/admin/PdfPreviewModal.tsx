'use client'

import { X, ExternalLink, Download, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PdfPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    url: string | null
    title: string
}

export default function PdfPreviewModal({ isOpen, onClose, url, title }: PdfPreviewModalProps) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
        }
    }, [isOpen, url])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <p className="text-xs text-slate-400">PDF Preview</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                title="Open in new tab"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        )}
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative bg-slate-950">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            <p>Loading document viewer...</p>
                        </div>
                    )}

                    {url ? (
                        <iframe
                            src={url}
                            className="w-full h-full border-none"
                            onLoad={() => setLoading(false)}
                            title={title}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 italic">
                            No document URL provided
                        </div>
                    )}
                </div>

                {/* Footer / Info */}
                <div className="p-3 border-t border-slate-700 bg-slate-800/30 text-[10px] text-slate-500 flex justify-between">
                    <span>Note: If preview doesn't load, use the external link button above.</span>
                    <span>Supports #page navigation in compatible browsers.</span>
                </div>
            </div>
        </div>
    )
}

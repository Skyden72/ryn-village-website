'use client'

import { useState } from 'react'
import { Wrench, Clock, CheckCircle, AlertCircle, User, Home } from 'lucide-react'
import { format } from 'date-fns'
import { updateRequestStatus } from '@/app/(admin)/admin/maintenance/actions'

type Request = {
    id: string
    title: string
    category: string
    status: string
    priority: string
    created_at: string
    description?: string
    residents: {
        full_name: string
        unit_number: string
    }
}

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-amber-500/20 text-amber-400' },
    in_progress: { label: 'In Progress', icon: AlertCircle, color: 'bg-blue-500/20 text-blue-400' },
    resolved: { label: 'Resolved', icon: CheckCircle, color: 'bg-emerald-500/20 text-emerald-400' },
}

export default function MaintenanceTable({ requests }: { requests: Request[] }) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')

    const filtered = requests.filter(r => filter === 'all' || r.status === filter)

    const counts = {
        pending: requests.filter(r => r.status === 'pending').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        resolved: requests.filter(r => r.status === 'resolved').length,
    }

    return (
        <>
            {/* Status Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'all'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    All ({requests.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    Pending ({counts.pending})
                </button>
                <button
                    onClick={() => setFilter('in_progress')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'in_progress'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    In Progress ({counts.in_progress})
                </button>
                <button
                    onClick={() => setFilter('resolved')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === 'resolved'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                >
                    Resolved ({counts.resolved})
                </button>
            </div>

            {/* Requests List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700">
                {filtered.map((request) => {
                    const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending
                    const StatusIcon = status.icon
                    return (
                        <div key={request.id} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${request.priority === 'urgent' ? 'bg-red-500/20' : 'bg-purple-500/20'
                                        }`}>
                                        <Wrench className={`w-5 h-5 ${request.priority === 'urgent' ? 'text-red-400' : 'text-purple-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-white">{request.title}</h3>
                                            {request.priority === 'urgent' && (
                                                <span className="text-xs font-medium text-red-400 bg-red-400/20 px-2 py-0.5 rounded">
                                                    URGENT
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                {request.residents?.full_name || 'Unknown'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Home className="w-3.5 h-3.5" />
                                                {request.residents?.unit_number || 'N/A'}
                                            </span>
                                            <span>{request.category}</span>
                                            <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                                        </div>
                                        {request.description && (
                                            <p className="text-slate-500 text-sm mt-2">{request.description}</p>
                                        )}
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {status.label}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-14">
                                {request.status === 'pending' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Start working on this request?')) {
                                                await updateRequestStatus(request.id, 'in_progress')
                                            }
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
                                    >
                                        Start Work
                                    </button>
                                )}
                                {request.status === 'in_progress' && (
                                    <button
                                        onClick={async () => {
                                            if (confirm('Mark this request as resolved?')) {
                                                await updateRequestStatus(request.id, 'resolved')
                                            }
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                    >
                                        Mark Resolved
                                    </button>
                                )}
                                <a
                                    href={`/admin/maintenance/${request.id}`}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    )
                })}

                {filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No requests found</p>
                    </div>
                )}
            </div>
        </>
    )
}

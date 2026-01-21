'use client'

import { Wrench, Plus, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from Supabase
const requests = [
    {
        id: '1',
        title: 'Leaking tap in kitchen',
        category: 'Plumbing',
        status: 'in_progress',
        priority: 'normal',
        createdAt: '2026-01-18',
        description: 'The kitchen tap has been dripping constantly.'
    },
    {
        id: '2',
        title: 'Light fixture not working',
        category: 'Electrical',
        status: 'pending',
        priority: 'normal',
        createdAt: '2026-01-20',
        description: 'The main bedroom light has stopped working.'
    },
    {
        id: '3',
        title: 'Gate motor repair',
        category: 'General',
        status: 'resolved',
        priority: 'normal',
        createdAt: '2026-01-10',
        description: 'The gate motor was making strange noises.',
        resolvedAt: '2026-01-12'
    },
]

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-100' },
    in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-blue-600 bg-blue-100' },
    resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
}

export default function MaintenancePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-800">
                        Maintenance Requests
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Submit and track your service requests
                    </p>
                </div>
                <Link
                    href="/maintenance/new"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </Link>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="divide-y divide-slate-100">
                    {requests.length === 0 ? (
                        <div className="p-12 text-center">
                            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No maintenance requests yet</p>
                            <Link
                                href="/maintenance/new"
                                className="text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block"
                            >
                                Submit your first request
                            </Link>
                        </div>
                    ) : (
                        requests.map((request) => {
                            const status = statusConfig[request.status as keyof typeof statusConfig]
                            const StatusIcon = status.icon
                            return (
                                <Link
                                    key={request.id}
                                    href={`/maintenance/${request.id}`}
                                    className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Wrench className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{request.title}</p>
                                            <p className="text-sm text-slate-500">{request.category} • {request.createdAt}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            {status.label}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

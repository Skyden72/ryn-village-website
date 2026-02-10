import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, User, Home, Calendar, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminMaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: request, error } = await supabase
        .from('maintenance_requests')
        .select(`
            *,
            residents (
                full_name,
                unit_number,
                email,
                phone
            )
        `)
        .eq('id', id)
        .single()

    if (error || !request) {
        console.error('Detail Fetch Error:', error)
        return (
            <div className="p-8 text-white">
                <h1 className="text-xl font-bold text-red-500">Debug: Request Not Found</h1>
                <pre className="bg-slate-900 p-4 mt-2 rounded border border-slate-700 overflow-auto">
                    {JSON.stringify({
                        error,
                        paramsId: id,
                        requestId: request?.id
                    }, null, 2)}
                </pre>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/admin/maintenance"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to requests
            </Link>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-8 border-b border-slate-700">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-serif font-bold text-white">{request.title}</h1>
                                {request.priority === 'urgent' && (
                                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded">
                                        URGENT
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-400">Request ID: {request.id}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium
                            ${request.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                request.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-emerald-500/20 text-emerald-400'}`}
                        >
                            {request.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Request Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <AlertCircle className="w-4 h-4 text-purple-400" />
                                    <span>{request.category}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                    <span>{format(new Date(request.created_at), 'MMMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <span>{format(new Date(request.created_at), 'h:mm a')}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Resident Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <User className="w-4 h-4 text-blue-400" />
                                    <span>{request.residents?.full_name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Home className="w-4 h-4 text-blue-400" />
                                    <span>Unit {request.residents?.unit_number || 'N/A'}</span>
                                </div>
                                {request.residents?.email && (
                                    <div className="flex items-center gap-3 text-slate-300">
                                        <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-blue-400">@</span>
                                        <span>{request.residents.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-medium text-white mb-4">Description</h3>
                    <div className="bg-slate-900/50 rounded-lg p-6 text-slate-300 leading-relaxed border border-slate-700/50">
                        {request.description || "No description provided."}
                    </div>
                </div>
            </div>
        </div>
    )
}

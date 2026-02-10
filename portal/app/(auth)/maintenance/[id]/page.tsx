import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Calendar, Clock, AlertCircle, Wrench, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-100' },
    in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-blue-600 bg-blue-100' },
    resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
}

export default async function ResidentMaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch request with admin client to bypass RLS (same logic as list view)
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: request, error } = await adminClient
        .from('maintenance_requests')
        .select(`
            *,
            residents (
                user_id
            )
        `)
        .eq('id', id)
        .single()

    if (error || !request) {
        return (
            <div className="p-8">
                <h1 className="text-xl font-bold text-red-600">Debug: Request Not Found or Access Denied</h1>
                <pre className="bg-slate-100 p-4 mt-2 rounded overflow-auto text-sm">
                    {JSON.stringify({
                        error,
                        paramsId: id,
                        userId: user.id
                    }, null, 2)}
                </pre>
            </div>
        )
    }

    // Security Check: Ensure the request belongs to the current user
    // We check if the resident associated with the request matches the current user's ID
    if (request.residents?.user_id !== user.id) {
        // Double check via email if user_id link is missing (robustness)
        const { data: residentCheck } = await adminClient
            .from('residents')
            .select('id')
            .eq('email', user.email)
            .maybeSingle()

        if (!residentCheck || request.resident_id !== residentCheck.id) {
            return (
                <div className="p-8">
                    <h1 className="text-xl font-bold text-red-600">Debug: Access Denied</h1>
                    <p>This request belongs to another resident.</p>
                    <pre className="bg-slate-100 p-4 mt-2 rounded overflow-auto text-sm">
                        {JSON.stringify({
                            currentUser: user.id,
                            requestResidentUserId: request.residents?.user_id,
                            requestResidentId: request.resident_id,
                            checkedResidentId: residentCheck?.id
                        }, null, 2)}
                    </pre>
                </div>
            )
        }
    }

    const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending
    const StatusIcon = status.icon

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href="/maintenance"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to requests
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                                <Wrench className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-slate-800">{request.title}</h1>
                                <p className="text-slate-500 text-sm mt-1">Request ID: {request.id}</p>
                            </div>
                        </div>
                        <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${status.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {status.label}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <AlertCircle className="w-4 h-4 text-purple-500 relative -top-px" />
                            <span className="font-medium">Category:</span>
                            {request.category}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4 text-purple-500 relative -top-px" />
                            <span className="font-medium">Created:</span>
                            {format(new Date(request.created_at), 'MMMM d, yyyy')}
                        </div>
                        {request.priority === 'urgent' && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Priority: Urgent</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Description</h3>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {request.description || "No detailed description provided."}
                    </div>
                </div>

                {/* Timeline or Updates could go here later */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Updates to your request status will appear here. Need immediate assistance? <a href="#" className="text-purple-600 font-medium hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { Plus, Clock, CheckCircle, AlertCircle, ChevronRight, Wrench } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-100' },
    in_progress: { label: 'In Progress', icon: AlertCircle, color: 'text-blue-600 bg-blue-100' },
    resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
}

export default async function MaintenancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch Resident Details (with Admin Fallback)
    let { data: resident } = await supabase
        .from('residents')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!resident) {
        const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
        const adminClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: adminResident } = await adminClient
            .from('residents')
            .select('id')
            .eq('user_id', user.id)
            .single()

        resident = adminResident
    }

    // 2. Fetch Maintenance Requests
    let requests: any[] = []

    if (resident) {
        const { data, error } = await supabase
            .from('maintenance_requests')
            .select('*')
            .eq('resident_id', resident.id)
            .order('created_at', { ascending: false })

        if (data) {
            requests = data
        } else if (error) {
            // Try Admin Client if RLS blocks read
            const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
            const adminClient = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            )
            const { data: adminRequests } = await adminClient
                .from('maintenance_requests')
                .select('*')
                .eq('resident_id', resident.id)
                .order('created_at', { ascending: false })

            if (adminRequests) requests = adminRequests
        }
    }

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
                            const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending
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
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <span>{request.category}</span>
                                                <span>•</span>
                                                <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                                            </div>
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

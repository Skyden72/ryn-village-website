import { createClient } from '@/lib/supabase/server'
import { Users, Megaphone, Receipt, Wrench, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch stats in parallel
    const [
        { count: residentsCount },
        { count: maintenanceCount },
        { count: announcementsCount },
        { count: openRequestsCount },
        { data: recentActivity }
    ] = await Promise.all([
        supabase.from('residents').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }).neq('status', 'resolved'),
        // Fetch recent maintenance requests as "activity" for now
        supabase.from('maintenance_requests')
            .select(`
                *,
                residents (unit_number)
            `)
            .order('created_at', { ascending: false })
            .limit(5)
    ])

    const stats = {
        totalResidents: residentsCount || 0,
        activeAnnouncements: announcementsCount || 0,
        openRequests: openRequestsCount || 0,
        // Bills not implemented yet in this fetch, placeholder
        pendingBills: 0,
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-white">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400 mt-1">
                    Manage Ryn Village resident portal
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="/admin/residents" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalResidents}</p>
                    <p className="text-sm text-slate-400">Total Residents</p>
                </Link>

                <Link href="/admin/announcements" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.activeAnnouncements}</p>
                    <p className="text-sm text-slate-400">Active Announcements</p>
                </Link>

                <Link href="/admin/bills" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-teal-400" />
                        </div>
                        {stats.pendingBills > 0 && (
                            <span className="text-xs font-medium text-amber-400 bg-amber-400/20 px-2 py-1 rounded">
                                {stats.pendingBills} unpaid
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.pendingBills}</p>
                    <p className="text-sm text-slate-400">Pending Bills</p>
                </Link>

                <Link href="/admin/maintenance" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Wrench className="w-5 h-5 text-purple-400" />
                        </div>
                        {stats.openRequests > 0 && (
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                        )}
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.openRequests}</p>
                    <p className="text-sm text-slate-400">Open Requests</p>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-white">Recent Maintenance Activity</h2>
                </div>
                <div className="divide-y divide-slate-700">
                    {(!recentActivity || recentActivity.length === 0) ? (
                        <div className="p-6 text-slate-400 text-center">No recent activity</div>
                    ) : (
                        recentActivity.map((activity: any) => (
                            <div key={activity.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                                    <p className="text-slate-300">
                                        <span className="font-medium text-white">New Request:</span> {activity.title} ({activity.residents?.unit_number || 'Unknown'})
                                    </p>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

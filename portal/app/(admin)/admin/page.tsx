import { Users, Megaphone, Receipt, Wrench, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from Supabase
const stats = {
    totalResidents: 187,
    activeAnnouncements: 5,
    pendingBills: 12,
    openRequests: 8,
}

const recentActivity = [
    { type: 'request', message: 'New maintenance request from Unit A12', time: '5 min ago' },
    { type: 'payment', message: 'Bill paid by Unit B7', time: '1 hour ago' },
    { type: 'resident', message: 'New resident registered: Unit C15', time: '2 hours ago' },
    { type: 'request', message: 'Request resolved: Plumbing issue Unit A8', time: '3 hours ago' },
]

export default function AdminDashboardPage() {
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
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                </div>
                <div className="divide-y divide-slate-700">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${activity.type === 'request' ? 'bg-purple-400' :
                                        activity.type === 'payment' ? 'bg-emerald-400' : 'bg-blue-400'
                                    }`} />
                                <p className="text-slate-300">{activity.message}</p>
                            </div>
                            <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { Bell, Receipt, Wrench, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // TODO: Fetch real data from Supabase tables
    const stats = {
        unreadAnnouncements: 3,
        unpaidBills: 1,
        pendingRequests: 2,
    }

    const recentAnnouncements = [
        { id: 1, title: 'Water maintenance scheduled for Saturday', date: '2026-01-20', priority: 'normal' },
        { id: 2, title: 'New recycling guidelines', date: '2026-01-18', priority: 'normal' },
        { id: 3, title: 'Emergency contact numbers updated', date: '2026-01-15', priority: 'urgent' },
    ]

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-800">
                    Welcome back!
                </h1>
                <p className="text-slate-600 mt-1">
                    {user?.email}
                </p>

                {/* Admin Link */}
                {await (async () => {
                    const { data: isAdmin } = await supabase
                        .from('admins')
                        .select('role')
                        .eq('id', user?.id)
                        .single()

                    if (isAdmin) {
                        return (
                            <div className="mt-4">
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                                >
                                    <Wrench className="w-4 h-4" />
                                    Access Admin Panel
                                </Link>
                            </div>
                        )
                    }
                    return null
                })()}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link
                    href="/announcements"
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{stats.unreadAnnouncements}</p>
                        <p className="text-sm text-slate-500">Unread Announcements</p>
                    </div>
                </Link>

                <Link
                    href="/bills"
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{stats.unpaidBills}</p>
                        <p className="text-sm text-slate-500">Outstanding Bills</p>
                    </div>
                </Link>

                <Link
                    href="/maintenance"
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{stats.pendingRequests}</p>
                        <p className="text-sm text-slate-500">Pending Requests</p>
                    </div>
                </Link>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-800">Recent Announcements</h2>
                    <Link href="/announcements" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentAnnouncements.map((announcement) => (
                        <Link
                            key={announcement.id}
                            href={`/announcements/${announcement.id}`}
                            className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {announcement.priority === 'urgent' && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                                )}
                                <div>
                                    <p className="font-medium text-slate-800">{announcement.title}</p>
                                    <p className="text-sm text-slate-500">{announcement.date}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

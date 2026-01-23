import { createClient } from '@/lib/supabase/server'
import { Bell, Receipt, Wrench, ChevronRight, Home, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch Resident Details
    // We try to find by user_id first, then by email if not linked yet
    let { data: resident } = await supabase
        .from('residents')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (!resident) {
        const { data: fallback } = await supabase
            .from('residents')
            .select('*')
            .eq('email', user.email)
            .single()

        if (fallback) {
            resident = fallback
            // Link them now for future visits
            await supabase.from('residents').update({ user_id: user.id }).eq('id', resident.id)
        }
    }

    // 2. Fetch Stats
    const { data: bills } = await supabase
        .from('bills')
        .select('id, amount, is_paid')
        .eq('resident_id', resident?.id)

    const unpaidBillsCount = bills?.filter(b => !b.is_paid).length || 0
    const totalOutstanding = bills?.filter(b => !b.is_paid).reduce((sum, b) => sum + b.amount, 0) || 0

    // Mock announcements for now until table is ready
    const recentAnnouncements = [
        { id: 1, title: 'Water maintenance scheduled for Saturday', date: '2026-01-20', priority: 'normal' },
        { id: 2, title: 'New recycling guidelines', date: '2026-01-18', priority: 'normal' },
        { id: 3, title: 'Emergency contact numbers updated', date: '2026-01-15', priority: 'urgent' },
    ]

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-800">
                    Welcome back, {resident?.full_name?.split(' ')[0] || 'Resident'}!
                </h1>
                <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-sm">
                        <Home className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{resident?.unit_number || 'Unit Pending'}</span>
                    </div>
                    <span className="text-sm">{user.email}</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link
                    href="/announcements"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <Bell className="w-6 h-6 text-amber-600" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">3</p>
                        <p className="text-sm text-slate-500 font-medium">Unread Announcements</p>
                    </div>
                </Link>

                <Link
                    href="/bills"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            <Receipt className="w-6 h-6 text-teal-600" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{unpaidBillsCount}</p>
                        <p className="text-sm text-slate-500 font-medium">Outstanding Bills</p>
                        {totalOutstanding > 0 && (
                            <p className="text-xs text-teal-600 mt-1 font-semibold">
                                Total: R {totalOutstanding.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>
                </Link>

                <Link
                    href="/maintenance"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <Wrench className="w-6 h-6 text-purple-600" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">0</p>
                        <p className="text-sm text-slate-500 font-medium">Active Requests</p>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Announcements */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800">Recent Announcements</h2>
                        <Link href="/announcements" className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1">
                            View all <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentAnnouncements.map((announcement) => (
                            <Link
                                key={announcement.id}
                                href={`/announcements/${announcement.id}`}
                                className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {announcement.priority === 'urgent' ? (
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                    ) : (
                                        <div className="w-2 h-2 bg-slate-300 rounded-full" />
                                    )}
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{announcement.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{announcement.date}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Important Actions / Reminder */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-serif font-bold mb-2">Need Maintenance?</h3>
                            <p className="text-slate-300 text-sm mb-6 max-w-sm">
                                Report issues with plumbing, electricity, or common areas directly through the portal.
                            </p>
                            <Link
                                href="/maintenance/new"
                                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20"
                            >
                                <Wrench className="w-5 h-5" />
                                Log a Request
                            </Link>
                        </div>
                        <Wrench className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
                    </div>

                    <div className="bg-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-serif font-bold mb-2">Fast Payment</h3>
                            <p className="text-teal-100 text-sm mb-6 max-w-sm">
                                View your latest levy invoice and settle your account securely.
                            </p>
                            <Link
                                href="/bills"
                                className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                            >
                                <CreditCard className="w-5 h-5" />
                                View Balance
                            </Link>
                        </div>
                        <Receipt className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 -rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}

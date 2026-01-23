'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Megaphone,
    Receipt,
    Wrench,
    LogOut,
    Menu,
    X,
    Shield,
    Upload
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Residents', href: '/admin/residents', icon: Users },
    { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { label: 'Bills', href: '/admin/bills', icon: Receipt },
    { label: 'Import', href: '/admin/invoices', icon: Upload },
    { label: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-amber-400" />
                    <div>
                        <p className="font-bold text-white">Ryn Village</p>
                        <p className="text-xs text-slate-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Back to Portal + Logout */}
            <div className="p-4 border-t border-slate-700 space-y-2">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Back to Portal</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-red-900/50 hover:text-red-400 rounded-lg transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white">Admin</span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-slate-300"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-slate-800 z-50 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
            >
                <NavContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-slate-800 flex-col z-30">
                <NavContent />
            </aside>
        </>
    )
}

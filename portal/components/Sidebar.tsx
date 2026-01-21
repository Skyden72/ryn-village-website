'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Megaphone,
    Receipt,
    Wrench,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Announcements', href: '/announcements', icon: Megaphone },
    { label: 'My Bills', href: '/bills', icon: Receipt },
    { label: 'Maintenance', href: '/maintenance', icon: Wrench },
    { label: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
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
            <div className="p-6 border-b border-slate-200">
                <img src="/logo.png" alt="Ryn Village" className="h-10" />
                <p className="text-xs text-slate-500 mt-1">Resident Portal</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-amber-500 text-white shadow-lg'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
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
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
                <img src="/logo.png" alt="Ryn Village" className="h-8" />
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-slate-600"
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
                className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
            >
                <NavContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex-col z-30">
                <NavContent />
            </aside>
        </>
    )
}

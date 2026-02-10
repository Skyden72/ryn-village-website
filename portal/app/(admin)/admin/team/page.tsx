'use client'

import { useState, useEffect, useTransition } from 'react'
import { useAdminRole } from '@/components/AdminRoleContext'
import { useRouter } from 'next/navigation'
import { getAdminUsers, addAdminUser, updateAdminRole, removeAdmin } from './actions'
import { Users2, Plus, Shield, ShieldCheck, Trash2, X, Loader2 } from 'lucide-react'

interface AdminUser {
    id: string
    name: string
    email: string
    role: 'super_admin' | 'staff'
    created_at: string
}

export default function TeamPage() {
    const { isSuperAdmin } = useAdminRole()
    const router = useRouter()
    const [admins, setAdmins] = useState<AdminUser[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isSuperAdmin) {
            router.push('/admin')
            return
        }
        loadAdmins()
    }, [isSuperAdmin, router])

    async function loadAdmins() {
        const result = await getAdminUsers()
        if (result.data) {
            setAdmins(result.data)
        }
        setLoading(false)
    }

    function handleAdd(formData: FormData) {
        setError('')
        setSuccess('')
        startTransition(async () => {
            const result = await addAdminUser(formData)
            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(result.isNewUser
                    ? 'Admin added. They can log in with the password reset flow.'
                    : 'Existing user promoted to admin.')
                setShowAddForm(false)
                loadAdmins()
            }
        })
    }

    function handleRoleChange(adminId: string, newRole: string) {
        setError('')
        setSuccess('')
        startTransition(async () => {
            const result = await updateAdminRole(adminId, newRole)
            if (result.error) {
                setError(result.error)
            } else {
                setSuccess('Role updated successfully')
                loadAdmins()
            }
        })
    }

    function handleRemove(admin: AdminUser) {
        if (!confirm(`Remove ${admin.name} (${admin.email}) from the admin team?`)) return
        setError('')
        setSuccess('')
        startTransition(async () => {
            const result = await removeAdmin(admin.id)
            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(`${admin.name} removed from admin team`)
                loadAdmins()
            }
        })
    }

    if (!isSuperAdmin) return null

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white">Team Management</h1>
                    <p className="text-slate-400 mt-1">Manage admin users and their roles</p>
                </div>
                <button
                    onClick={() => { setShowAddForm(!showAddForm); setError(''); setSuccess('') }}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg"
                >
                    {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showAddForm ? 'Cancel' : 'Add Admin'}
                </button>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-6">
                    {success}
                </div>
            )}

            {/* Add Admin Form */}
            {showAddForm && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Add New Admin</h2>
                    <form action={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Smith"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="admin@rynvillage.co.za"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Role
                            </label>
                            <select
                                name="role"
                                defaultValue="staff"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            >
                                <option value="staff">Staff — Can use all portal functions</option>
                                <option value="super_admin">Super Admin — Can also manage admin users</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Add Admin
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admin List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-amber-400" />
                        <h2 className="text-lg font-semibold text-white">Admin Team</h2>
                        <span className="ml-auto text-sm text-slate-400">{admins.length} member{admins.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700">
                        {admins.map((admin) => (
                            <div key={admin.id} className="p-5 flex items-center justify-between hover:bg-slate-750 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${admin.role === 'super_admin'
                                            ? 'bg-amber-500/20'
                                            : 'bg-slate-600/50'
                                        }`}>
                                        {admin.role === 'super_admin'
                                            ? <ShieldCheck className="w-5 h-5 text-amber-400" />
                                            : <Shield className="w-5 h-5 text-slate-400" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{admin.name}</p>
                                        <p className="text-sm text-slate-400">{admin.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={admin.role}
                                        onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                                        disabled={isPending}
                                        className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500 disabled:opacity-50 transition-colors"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>

                                    <button
                                        onClick={() => handleRemove(admin)}
                                        disabled={isPending}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                        title="Remove admin"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Role Legend */}
            <div className="mt-6 bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-amber-400">Super Admin</p>
                            <p className="text-slate-400">Full portal access + manage admin team</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-slate-300">Staff</p>
                            <p className="text-slate-400">Full portal access, cannot manage admins</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

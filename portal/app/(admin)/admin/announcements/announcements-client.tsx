'use client'

import { startTransition, useTransition } from 'react'
import { Megaphone, Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { deleteAnnouncement, togglePublish } from './actions'

interface Announcement {
    id: string
    title: string
    content: string
    priority: string
    is_published: boolean
    published_at: string | null
    created_at: string
}

export default function AdminAnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return

        startTransition(async () => {
            await deleteAnnouncement(id)
        })
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            await togglePublish(id, currentStatus)
        })
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white">
                        Announcements
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Create and manage announcements
                    </p>
                </div>
                <Link
                    href="/admin/announcements/new" // This page needs to be created or checked
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Announcement
                </Link>
            </div>

            {/* Announcements List */}
            <div className={`bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700 ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${announcement.priority === 'urgent' ? 'bg-red-500/20' : 'bg-amber-500/20'
                                }`}>
                                <Megaphone className={`w-5 h-5 ${announcement.priority === 'urgent' ? 'text-red-400' : 'text-amber-400'
                                    }`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-white">{announcement.title}</p>
                                    {announcement.priority === 'urgent' && (
                                        <span className="text-xs font-medium text-red-400 bg-red-400/20 px-2 py-0.5 rounded">
                                            URGENT
                                        </span>
                                    )}
                                    {!announcement.is_published && (
                                        <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-0.5 rounded">
                                            DRAFT
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400">
                                    {announcement.published_at ? new Date(announcement.published_at).toLocaleDateString() : 'Not published'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleToggle(announcement.id, announcement.is_published)}
                                className={`p-2 rounded-lg transition-colors ${announcement.is_published
                                    ? 'text-emerald-400 hover:bg-emerald-900/30'
                                    : 'text-slate-400 hover:bg-slate-600'
                                    }`}>
                                {announcement.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            {/* Edit functionality to be implemented - linking to dynamic route */}
                            {/* <Link href={`/admin/announcements/${announcement.id}`}> */}
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                            </button>
                            {/* </Link> */}
                            <button
                                onClick={() => handleDelete(announcement.id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="p-12 text-center">
                        <Megaphone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No announcements yet</p>
                    </div>
                )}
            </div>
            {isPending && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50 pointer-events-none">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
            )}
        </div>
    )
}

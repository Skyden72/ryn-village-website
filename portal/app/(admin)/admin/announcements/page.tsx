'use client'

import { useState } from 'react'
import { Megaphone, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from Supabase
const initialAnnouncements = [
    { id: '1', title: 'Water maintenance scheduled for Saturday', priority: 'urgent', isPublished: true, publishedAt: '2026-01-20' },
    { id: '2', title: 'New recycling guidelines', priority: 'normal', isPublished: true, publishedAt: '2026-01-18' },
    { id: '3', title: 'Monthly meeting reminder', priority: 'normal', isPublished: true, publishedAt: '2026-01-15' },
    { id: '4', title: 'Holiday schedule (Draft)', priority: 'low', isPublished: false, publishedAt: null },
]

export default function AdminAnnouncementsPage() {
    const [announcements] = useState(initialAnnouncements)

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
                    href="/admin/announcements/new"
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Announcement
                </Link>
            </div>

            {/* Announcements List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700">
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
                                    {!announcement.isPublished && (
                                        <span className="text-xs font-medium text-slate-400 bg-slate-600/50 px-2 py-0.5 rounded">
                                            DRAFT
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400">
                                    {announcement.publishedAt || 'Not published'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className={`p-2 rounded-lg transition-colors ${announcement.isPublished
                                    ? 'text-emerald-400 hover:bg-emerald-900/30'
                                    : 'text-slate-400 hover:bg-slate-600'
                                }`}>
                                {announcement.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
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
        </div>
    )
}

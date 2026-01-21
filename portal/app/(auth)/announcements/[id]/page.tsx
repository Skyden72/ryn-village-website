import { ArrowLeft, Bell, Calendar } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from Supabase based on params.id
const announcement = {
    id: '1',
    title: 'Water maintenance scheduled for Saturday',
    content: `Dear Residents,

Please be advised that essential water maintenance will be conducted this Saturday.

**Schedule:**
- Start: 8:00 AM
- End: 12:00 PM (estimated)

**What to expect:**
- Water supply will be temporarily shut off during this period
- Please store sufficient water for your needs
- Hot water systems may take time to refill after service resumes

**Affected Areas:**
All units in Blocks A, B, and C will be affected.

We apologize for any inconvenience and appreciate your understanding.

If you have any questions, please contact the office at (012) 345-6789.

Best regards,
Ryn Village Management`,
    date: '2026-01-20',
    priority: 'normal',
    author: 'Estate Management',
}

export default function AnnouncementDetailPage({
    params
}: {
    params: { id: string }
}) {
    return (
        <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
                href="/announcements"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to announcements
            </Link>

            {/* Announcement Card */}
            <article className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${announcement.priority === 'urgent' ? 'bg-red-100' : 'bg-amber-100'
                            }`}>
                            <Bell className={`w-5 h-5 ${announcement.priority === 'urgent' ? 'text-red-600' : 'text-amber-600'
                                }`} />
                        </div>
                        {announcement.priority === 'urgent' && (
                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                                URGENT
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-slate-800">
                        {announcement.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {announcement.date}
                        </span>
                        <span>•</span>
                        <span>{announcement.author}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="prose prose-slate max-w-none whitespace-pre-line">
                        {announcement.content}
                    </div>
                </div>
            </article>
        </div>
    )
}

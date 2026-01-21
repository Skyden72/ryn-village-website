import { Bell, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// TODO: Fetch from Supabase
const announcements = [
    {
        id: '1',
        title: 'Water maintenance scheduled for Saturday',
        content: 'The water will be shut off between 8am and 12pm for essential maintenance work.',
        date: '2026-01-20',
        priority: 'normal',
        read: false
    },
    {
        id: '2',
        title: 'New recycling guidelines',
        content: 'Please review the updated recycling guidelines attached to this announcement.',
        date: '2026-01-18',
        priority: 'normal',
        read: true
    },
    {
        id: '3',
        title: 'Emergency contact numbers updated',
        content: 'The estate emergency contact numbers have been updated. Please save the new numbers.',
        date: '2026-01-15',
        priority: 'urgent',
        read: false
    },
    {
        id: '4',
        title: 'Monthly residents meeting',
        content: 'The monthly residents meeting will be held in the community hall on the 25th.',
        date: '2026-01-10',
        priority: 'normal',
        read: true
    },
]

export default function AnnouncementsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-800">
                    Announcements
                </h1>
                <p className="text-slate-600 mt-1">
                    Stay updated with the latest news from Ryn Village
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                {announcements.map((announcement) => (
                    <Link
                        key={announcement.id}
                        href={`/announcements/${announcement.id}`}
                        className={`p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors ${!announcement.read ? 'bg-amber-50/50' : ''
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${announcement.priority === 'urgent'
                                ? 'bg-red-100'
                                : 'bg-amber-100'
                            }`}>
                            <Bell className={`w-5 h-5 ${announcement.priority === 'urgent'
                                    ? 'text-red-600'
                                    : 'text-amber-600'
                                }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {!announcement.read && (
                                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                                )}
                                {announcement.priority === 'urgent' && (
                                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                        URGENT
                                    </span>
                                )}
                            </div>
                            <p className={`font-medium ${!announcement.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {announcement.title}
                            </p>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                {announcement.content}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">{announcement.date}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-2" />
                    </Link>
                ))}
            </div>
        </div>
    )
}

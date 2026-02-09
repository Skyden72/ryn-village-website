import { createClient } from '@/lib/supabase/server'
import AdminAnnouncementsClient from './announcements-client'

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
    const supabase = await createClient()

    const { data: announcements, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching announcements:', error)
        // Ideally render an error boundary or message
    }

    return <AdminAnnouncementsClient announcements={announcements || []} />
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch resident data
    const { data: resident } = await supabase
        .from('residents')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Handle case where resident record might not exist yet (though login should create it)
    if (!resident) {
        // Fallback or error - simplistic handling for now
        // Maybe redirect to dashboard which handles linking?
        redirect('/dashboard')
    }

    return <ProfileForm initialData={resident} />
}

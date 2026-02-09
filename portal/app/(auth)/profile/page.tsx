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
    let { data: resident, error } = await supabase
        .from('residents')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // Fallback: Check with Admin Client (in case RLS is missing)
    if (!resident) {
        // Dynamically import to avoid build issues if mixed? No, server component fine.
        const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
        const adminClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: adminResident } = await adminClient
            .from('residents')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (adminResident) {
            resident = adminResident
        }
    }

    // Handle case where resident record might not exist yet
    if (!resident) {
        return (
            <div className="p-8 text-center text-slate-400">
                <h1 className="text-xl font-bold text-white mb-2">Profile Not Linked</h1>
                <p>We couldn't find a resident profile linked to your account.</p>
                <p className="mt-4">Please contact the office for assistance.</p>
                <p className="text-xs mt-2 opacity-50">User ID: {user.id}</p>
            </div>
        )
    }

    return <ProfileForm initialData={resident} />
}

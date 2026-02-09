'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { notifyAdmins } from '@/lib/notifications/admin-notifications'

export async function submitMaintenanceRequest(formData: FormData) {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to submit a request.' }
    }

    // 2. Extract Data
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    // 3. Insert into Database
    // Lookup resident ID first (it might differ from auth.uid if pre-created)
    let { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('id, unit_number, full_name')
        .eq('user_id', user.id)
        .single()

    if (!resident) {
        // Fallback to Admin Client
        const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
        const adminClient = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Try getting by User ID first
        const { data: adminResident } = await adminClient
            .from('residents')
            .select('id, unit_number, full_name')
            .eq('user_id', user.id)
            .single()

        if (adminResident) {
            resident = adminResident
        } else {
            // Try by email if not linked
            const { data: fallback } = await adminClient
                .from('residents')
                .select('id, unit_number, full_name')
                .eq('email', user.email)
                .single()

            if (fallback) {
                resident = fallback
                // Auto-link
                await adminClient.from('residents').update({ user_id: user.id }).eq('id', fallback.id)
            }
        }
    }

    if (!resident) {
        console.error('Maintenance error: Resident not found for user', user.id)
        return { error: 'Resident profile not found. Please contact admin.' }
    }

    // Use Admin Client for INSERT to bypass RLS policies
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await adminClient.from('maintenance_requests').insert({
        resident_id: resident.id,
        title,
        category,
        description,
        priority,
        status: 'pending'
    })

    if (error) {
        console.error('Maintenance request error:', error)
        return { error: 'Failed to submit request. Please try again.' }
    }

    // 4. Send Notification
    await notifyAdmins('maintenance_created', {
        title: `New Maintenance Request: ${title}`,
        description: `Category: ${category}\nPriority: ${priority}\n\n${description}`,
        residentName: resident?.full_name || user.email || 'Unknown',
        unitNumber: resident?.unit_number || 'N/A'
    })

    revalidatePath('/maintenance')
    return { success: true }
}

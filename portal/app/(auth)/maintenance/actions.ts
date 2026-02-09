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
    const { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('id, unit_number, full_name')
        .eq('user_id', user.id)
        .single()

    if (residentError || !resident) {
        console.error('Maintenance error: Resident not found for user', user.id)
        return { error: 'Resident profile not found. Please contact admin.' }
    }

    const { error } = await supabase.from('maintenance_requests').insert({
        resident_id: resident.id, // Use the actual resident UUID
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

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
    // First, we need to get the resident record to link it properly
    // Assumes 'residents' table has an 'id' that matches 'auth.users.id'
    // or we use the auth.uid() directly if the foreign key is set up that way.
    // Based on schema: resident_id UUID REFERENCES public.residents(id)
    // And residents.id is referencing auth.users(id). 

    // We don't necessarily need to query the resident table if the ID is the same,
    // but we might want the Unit Number for the notification.
    const { data: resident } = await supabase
        .from('residents')
        .select('unit_number, full_name')
        .eq('id', user.id)
        .single()

    const { error } = await supabase.from('maintenance_requests').insert({
        resident_id: user.id,
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

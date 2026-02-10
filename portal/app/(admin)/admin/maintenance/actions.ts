'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRequestStatus(requestId: string, newStatus: 'in_progress' | 'resolved') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('maintenance_requests')
        .update({ status: newStatus })
        .eq('id', requestId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/maintenance')
    return { success: true }
}

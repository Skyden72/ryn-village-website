'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBillStatus(id: string, isPaid: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('bills')
        .update({
            is_paid: isPaid,
            paid_at: isPaid ? new Date().toISOString() : null
        })
        .eq('id', id)

    if (error) {
        throw new Error(`Failed to update bill status: ${error.message}`)
    }

    revalidatePath('/admin/bills')
}

export async function getBillDownloadUrl(path: string, pageNumber?: number) {
    const supabase = await createClient()

    // 60 seconds expiry for signed URL
    const { data, error } = await supabase.storage
        .from('invoices')
        .createSignedUrl(path, 60)

    if (error || !data) {
        throw new Error('Failed to generate download URL')
    }

    // Append page fragment for PDF viewers that support it
    const url = pageNumber ? `${data.signedUrl}#page=${pageNumber}` : data.signedUrl
    return url
}

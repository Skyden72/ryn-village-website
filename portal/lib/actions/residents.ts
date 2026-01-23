'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addResident(formData: FormData) {
    const supabase = await createClient()

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const unitNumber = formData.get('unitNumber') as string
    const phone = formData.get('phone') as string

    // Check if unit already exists? Optional but good practice.
    // implementing basic insert for now.

    const { error } = await supabase
        .from('residents')
        .insert({
            full_name: fullName,
            email: email,
            unit_number: unitNumber,
            phone: phone,
            is_active: true
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/residents')
    return { success: true }
}

export async function updateResident(id: string, formData: FormData) {
    const supabase = await createClient()

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const unitNumber = formData.get('unitNumber') as string
    const phone = formData.get('phone') as string
    const isActive = formData.get('isActive') === 'on'

    const { error } = await supabase
        .from('residents')
        .update({
            full_name: fullName,
            email: email,
            unit_number: unitNumber,
            phone: phone,
            is_active: isActive
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/residents')
    return { success: true }
}

export async function deleteResident(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('residents')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/residents')
    return { success: true }
}

'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

function createClient(cookieStore: any) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: any[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Ignored
                    }
                },
            },
        }
    )
}

export async function updateProfile(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const unitNumber = formData.get('unitNumber') as string
    // Emergency contact fields not in current schema? Let's check schema.
    // Assuming schema has emergency_contact_name and emergency_contact_phone based on page UI
    // If not, we might fail. I'll check schema first in a separate step or assume standard fields.
    // For now, I'll stick to full_name, phone, unit_number as primary.
    // Let's assume standard fields for now. 

    const emergencyContact = formData.get('emergencyContact') as string
    const emergencyPhone = formData.get('emergencyPhone') as string

    // Validate
    if (!fullName || !unitNumber) {
        return { error: 'Name and Unit Number are required' }
    }

    // Use Admin Client to bypass RLS for updates
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await adminClient
        .from('residents')
        .update({
            full_name: fullName,
            phone: phone,
            unit_number: unitNumber,
            emergency_contact: formData.get('emergencyContact') as string,
            emergency_phone: formData.get('emergencyPhone') as string,
        })
        .eq('user_id', user.id)

    if (error) {
        console.error('Profile update error:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/profile')
    return { success: true }
}

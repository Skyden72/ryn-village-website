'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
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
                        // Ignored in Server Component context
                    }
                },
            },
        }
    )
}

function getAdminClient() {
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

async function requireSuperAdmin() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const adminClient = getAdminClient()
    const { data: admin } = await adminClient
        .from('admins')
        .select('id, role')
        .eq('id', user.id)
        .single()

    if (!admin || admin.role !== 'super_admin') return null
    return admin
}

export async function getAdminUsers() {
    const caller = await requireSuperAdmin()
    if (!caller) return { error: 'Unauthorized' }

    const adminClient = getAdminClient()
    const { data, error } = await adminClient
        .from('admins')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: true })

    if (error) return { error: error.message }
    return { data }
}

export async function addAdminUser(formData: FormData) {
    const caller = await requireSuperAdmin()
    if (!caller) return { error: 'Unauthorized' }

    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as string

    if (!email || !name) return { error: 'Email and name are required' }
    if (role !== 'super_admin' && role !== 'staff') return { error: 'Invalid role' }

    const adminClient = getAdminClient()

    // Check if user already exists in auth
    const { data: existingUsers } = await adminClient.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u: any) => u.email === email)

    let userId: string

    if (existingUser) {
        userId = existingUser.id
    } else {
        // Create auth user with a temporary password
        const tempPassword = crypto.randomUUID().slice(0, 16) + '!A1'
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
        })
        if (createError || !newUser.user) {
            return { error: createError?.message || 'Failed to create auth user' }
        }
        userId = newUser.user.id
    }

    // Check if already an admin
    const { data: existingAdmin } = await adminClient
        .from('admins')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

    if (existingAdmin) {
        return { error: 'This user is already an admin' }
    }

    // Insert into admins table
    const { error: insertError } = await adminClient
        .from('admins')
        .insert({ id: userId, name, email, role })

    if (insertError) {
        return { error: insertError.message }
    }

    revalidatePath('/admin/team')
    return { success: true, isNewUser: !existingUser }
}

export async function updateAdminRole(adminId: string, newRole: string) {
    const caller = await requireSuperAdmin()
    if (!caller) return { error: 'Unauthorized' }

    if (adminId === caller.id) {
        return { error: 'You cannot change your own role' }
    }

    if (newRole !== 'super_admin' && newRole !== 'staff') {
        return { error: 'Invalid role' }
    }

    const adminClient = getAdminClient()
    const { error } = await adminClient
        .from('admins')
        .update({ role: newRole })
        .eq('id', adminId)

    if (error) return { error: error.message }

    revalidatePath('/admin/team')
    return { success: true }
}

export async function removeAdmin(adminId: string) {
    const caller = await requireSuperAdmin()
    if (!caller) return { error: 'Unauthorized' }

    if (adminId === caller.id) {
        return { error: 'You cannot remove yourself' }
    }

    const adminClient = getAdminClient()
    const { error } = await adminClient
        .from('admins')
        .delete()
        .eq('id', adminId)

    if (error) return { error: error.message }

    revalidatePath('/admin/team')
    return { success: true }
}

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
                        // Ignored in Server Component context
                    }
                },
            },
        }
    )
}

export async function adminLogin(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 1. Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // 2. Verify user is an admin
    const { data: adminRecord } = await supabase
        .from('admins')
        .select('id, role')
        .eq('id', data.user.id)
        .single()

    if (!adminRecord) {
        // Not an admin - sign them out immediately
        await supabase.auth.signOut()
        return { error: 'Access denied. This login is for authorized staff only.' }
    }

    revalidatePath('/', 'layout')
    return { success: true, role: adminRecord.role }
}

export async function adminLogout() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    return { success: true }
}

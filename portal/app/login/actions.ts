'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export async function login(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signup(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // We immediately sign the user up
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    // Check if user already exists error or other errors
    if (error) {
        return { error: error.message }
    }

    // Link to existing resident record if available, otherwise create new
    if (data.user) {
        const { data: existing } = await supabase
            .from('residents')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            // Link existing record
            await supabase
                .from('residents')
                .update({ user_id: data.user.id })
                .eq('id', existing.id)
        } else {
            // Create new placeholder record
            await supabase.from('residents').insert({
                user_id: data.user.id,
                unit_number: 'PENDING',
                full_name: email.split('@')[0],
                email: email
            })
        }
    }

    // If email confirmation is off, this will log them in correctly.
    revalidatePath('/', 'layout')
    return { success: true }
}

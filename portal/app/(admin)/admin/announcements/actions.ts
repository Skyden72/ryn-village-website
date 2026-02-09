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

export async function createAnnouncement(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check admin auth (optional detail: we could reuse getAdminUser pattern or trust middleware/layout)
    // But safe to check user exists
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const priority = formData.get('priority') as string || 'normal'
    const isPublished = formData.get('isPublished') === 'on'

    if (!title || !content) {
        return { error: 'Title and content are required' }
    }

    const { error } = await supabase.from('announcements').insert({
        title,
        content,
        priority,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
        created_by: user.id
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/announcements')
    return { success: true }
}

export async function deleteAnnouncement(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/announcements')
    return { success: true }
}

export async function togglePublish(id: string, currentStatus: boolean) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
        .from('announcements')
        .update({
            is_published: !currentStatus,
            published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/announcements')
    return { success: true }
}

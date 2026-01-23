import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import AdminSidebar from '@/components/AdminSidebar'

async function getAdminUser() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
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

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Check if user is in admins table
    const { data: adminRecord } = await supabase
        .from('admins')
        .select('id, name, role')
        .eq('id', user.id)
        .single()

    return adminRecord
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const admin = await getAdminUser()

    if (!admin) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <AdminSidebar />
            {/* Main content area */}
            {/* Main content area */}
            <main className="lg:ml-64 pt-16 lg:pt-8 min-h-screen">
                <div className="p-6 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}


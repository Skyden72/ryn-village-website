import { createClient } from '@/lib/supabase/server'
import MaintenanceTable from '@/components/admin/MaintenanceTable'

export const dynamic = 'force-dynamic'

export default async function AdminMaintenancePage() {
    const supabase = await createClient()

    const { data: requests, error } = await supabase
        .from('maintenance_requests')
        .select(`
            *,
            residents (
                full_name,
                unit_number
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="p-8 text-red-400">
                Error loading requests: {error.message}
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-white">
                    Maintenance Requests
                </h1>
                <p className="text-slate-400 mt-1">
                    View and manage service requests
                </p>
            </div>

            <MaintenanceTable requests={requests || []} />
        </div>
    )
}

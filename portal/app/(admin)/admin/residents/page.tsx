import { createClient } from '@/lib/supabase/server'
import ResidentsTable from '@/components/admin/ResidentsTable'

export const dynamic = 'force-dynamic'

export default async function AdminResidentsPage() {
    const supabase = await createClient()

    const { data: residents, error } = await supabase
        .from('residents')
        .select(`
            id,
            full_name,
            unit_number,
            email,
            phone,
            is_active
        `)
        .order('unit_number', { ascending: true })

    if (error) {
        return (
            <div className="p-8 text-red-400">
                Error loading residents: {error.message}
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto">
            <ResidentsTable initialResidents={residents || []} />
        </div>
    )
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkData() {
    console.log('--- Checking Maintenance Requests ---')
    const { data: requests, error: reqError } = await supabase
        .from('maintenance_requests')
        .select(`*, residents(email, full_name, unit_number)`)
        .order('created_at', { ascending: false })

    if (reqError) console.error('Error fetching requests:', reqError)
    else {
        console.log(`Found ${requests?.length} requests:`)
        requests?.forEach(r => {
            console.log(`- [${r.status}] ${r.title} (Resident: ${r.residents?.full_name || 'Unknown'})`)
        })
    }

    console.log('\n--- Checking Residents ---')
    const { data: residents, error: resError } = await supabase
        .from('residents')
        .select('*')
        .limit(10)

    if (resError) console.error('Error fetching residents:', resError)
    else {
        console.log(`Found ${residents?.length} residents (showing first 10):`)
        residents?.forEach(r => {
            console.log(`- ${r.full_name} (${r.email}) - Unit: ${r.unit_number} - UserID: ${r.user_id}`)
        })
    }
}

checkData()

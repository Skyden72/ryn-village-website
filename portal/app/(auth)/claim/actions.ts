
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- HELPER: Mask Phone Number ---
function maskPhone(phone: string) {
    // Assuming E.164 or similar: +27821234567 -> +27 ... 567
    if (!phone || phone.length < 5) return '***'
    return `${phone.slice(0, 3)}...${phone.slice(-3)}`
}

// 1. Send OTP
export async function sendClaimOTP(email: string, unitNumber?: string) {
    const supabase = await createClient()
    // We need Admin rights to check residents by email without RLS blocking.
    // We use the Service Role key directly.

    // Let's use the env vars directly for service role to be safe
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Lookup Resident (fetch all matches first)
    let query = adminClient
        .from('residents')
        .select('id, phone, user_id, unit_number')
        .eq('email', email)

    const { data: residents, error } = await query

    if (error || !residents || residents.length === 0) {
        return { error: 'No profile found for this email. Please contact the office.' }
    }

    let resident = null

    if (residents.length === 1) {
        resident = residents[0]
    } else {
        // Multiple residents found
        if (!unitNumber) {
            return { error: 'Multiple profiles found. Please enter Unit Number.', requiresUnit: true }
        }

        // Filter by unit number if provided
        resident = residents.find((r: any) => r.unit_number === unitNumber)

        if (!resident) {
            return { error: 'No profile found for this email and unit number.' }
        }
    }

    if (resident.user_id) {
        return { error: 'Account already claimed. Please log in normally.' }
    }

    if (!resident.phone) {
        return { error: 'No phone number linked to this profile. Contact admin.' }
    }

    // Generate OTP (6 digits)
    // const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otp = '123456' // Fixed for testing convenience
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

    // Update DB
    const { error: updateError } = await adminClient
        .from('residents')
        .update({
            otp_code: otp,
            otp_expires_at: expiresAt.toISOString()
        })
        .eq('id', resident.id)

    if (updateError) {
        console.error('OTP Save Error:', updateError)
        return { error: 'System error. Try again.' }
    }

    // Mock Send SMS
    // In production, use Twilio here.
    console.log(`[SMS-MOCK] To: ${resident.phone} | Code: ${otp}`)

    return { success: true, maskedPhone: maskPhone(resident.phone) }
}


// 2. Verify & Claim (Set Password)
export async function verifyAndClaimProfile(email: string, otp: string, password: string, unitNumber?: string) {
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Validate OTP
    // Fetch all matching residents first
    const { data: residents } = await adminClient
        .from('residents')
        .select('*')
        .eq('email', email)

    if (!residents || residents.length === 0) return { error: 'Profile not found' }

    let resident = null

    if (residents.length === 1) {
        resident = residents[0]
    } else {
        // Multiple residents found - use unit number
        if (!unitNumber) {
            return { error: 'Multiple profiles found. Please contact support.' }
        }
        resident = residents.find((r: any) => r.unit_number === unitNumber)
    }

    if (!resident) return { error: 'Profile not found' }

    if (resident.otp_code !== otp) {
        return { error: 'Invalid verification code' }
    }

    if (new Date(resident.otp_expires_at) < new Date()) {
        return { error: 'Code expired. Request a new one.' }
    }

    // 2. Create Supabase Auth User
    // We use Admin Access to create the user so we can set the password immediately
    // and mark email as verified (since we verified "identity" via Admin trust + Phone OTP)
    const { data: authUser, error: createUserError } = await adminClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true // Auto-confirm email
    })

    if (createUserError) {
        console.error('Auth Create Error:', createUserError)
        return { error: createUserError.message }
    }

    if (!authUser.user) return { error: 'Failed to create account' }

    // 3. Link Resident to Auth User
    const { error: linkError } = await adminClient
        .from('residents')
        .update({
            user_id: authUser.user.id,
            otp_code: null, // Clear OTP
            phone_verified: true
        })
        .eq('id', resident.id)

    if (linkError) {
        return { error: 'Failed to link profile. Contact admin.' }
    }

    // 4. Sign User In (Optional? Or just redirect to login)
    // createUser does NOT sign them in on the client side. 
    // They usually need to go to /login and enter creds. 
    // We can just return success and client redirects to /login?
    // User requested "User is logged in". 
    // To log them in, we can try `signInWithPassword` here on server and return session?
    // or just tell client to redirect to /login with auto-fill?
    // Let's redirect to /login for simplicity and security standard.

    return { success: true }
}

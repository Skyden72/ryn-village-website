
import { NextRequest, NextResponse } from 'next/server'
import { parseSendGridRequest, extractTextFromPDF, extractUnitNumber } from '@/lib/mail/parse-utils'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const email = await parseSendGridRequest(formData)

        // ... (Supabase Init)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const uploadedFiles = []
        let billsCreated = 0

        // 3. Process Attachments
        for (const attachment of email.attachments) {
            if (attachment.contentType === 'application/pdf') {
                const timestamp = Date.now()
                const safeFilename = attachment.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
                const path = `uploads/${timestamp}_${safeFilename}`

                // Upload to Storage
                const { error: uploadError } = await supabaseAdmin
                    .storage
                    .from('admin-uploads')
                    .upload(path, attachment.content, {
                        contentType: 'application/pdf',
                        upsert: false
                    })

                if (uploadError) {
                    console.error('Upload failed:', uploadError)
                    continue
                }

                // --- SMART PARSING Logic ---
                let residentId = null
                let unitFound = null

                // Extract text from PDF
                const text = await extractTextFromPDF(attachment.content)
                const unitNumber = extractUnitNumber(text)

                if (unitNumber) {
                    unitFound = unitNumber
                    // Find Resident by Unit Number
                    // Note: 'residents' table MUST store unit_number consistent with extraction (e.g. '25', not 'RV025')
                    // Or we assume the DB has '25' and we strip everything.
                    const { data: resident } = await supabaseAdmin
                        .from('residents')
                        .select('id')
                        .eq('unit_number', unitNumber) // Ensure DB Unit Numbers are clean (e.g. '25')
                        .single()

                    if (resident) {
                        residentId = resident.id

                        // Create Bill Record automatically
                        await supabaseAdmin.from('bills').insert({
                            resident_id: residentId,
                            amount: 0, // TODO: Extract amount?
                            description: `Imported Invoice: ${attachment.filename}`,
                            month: new Date().toISOString(), // Default to current month
                            pdf_url: path,
                            is_paid: false
                        })
                        billsCreated++
                    }
                }

                // Create generic Document Record
                const { error: dbError } = await supabaseAdmin
                    .from('documents')
                    .insert({
                        filename: attachment.filename,
                        file_path: path,
                        content_type: attachment.contentType,
                        file_size: attachment.size,
                        source: 'email',
                        sender_email: email.from,
                        // Store metadata about parsing
                        metadata: {
                            unit_detected: unitFound,
                            resident_linked: !!residentId
                        }
                    })

                uploadedFiles.push(path)
            }
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles.length,
            bills_created: billsCreated
        })

    } catch (error: any) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}

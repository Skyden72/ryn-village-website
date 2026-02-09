
import { NextRequest, NextResponse } from 'next/server'
import { parseSendGridRequest, extractTextFromPDF, extractUnitNumber } from '@/lib/mail/parse-utils'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const email = await parseSendGridRequest(formData)

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

                // Fallback: Check Filename if PDF text fails
                const unitFromFilename = extractUnitNumber(attachment.filename)

                const finalUnitNumber = unitNumber || unitFromFilename

                if (finalUnitNumber) {
                    unitFound = finalUnitNumber
                    // Find Resident by Unit Number
                    const { data: resident } = await supabaseAdmin
                        .from('residents')
                        .select('id')
                        .eq('unit_number', finalUnitNumber)
                        .single()

                    if (resident) {
                        residentId = resident.id

                        // Create Bill Record automatically
                        await supabaseAdmin.from('bills').insert({
                            resident_id: residentId,
                            amount: 0, // Default 0, admin updates later
                            description: `Imported Invoice: ${attachment.filename}`,
                            month: new Date().toISOString(),
                            pdf_url: path,
                            is_paid: false,
                            uploaded_by_email: email.from // Useful for audit
                        })
                        billsCreated++
                    }
                }

                // Create generic Document Record
                // Note: The fields here must match the schema exactly.
                const { error: dbError } = await supabaseAdmin
                    .from('documents')
                    .insert({
                        filename: attachment.filename,
                        file_path: path,
                        content_type: attachment.contentType,
                        file_size: attachment.size,
                        source: 'email',
                        metadata: {
                            unit_detected: unitFound,
                            resident_linked: !!residentId,
                            sender: email.from
                        }
                    })

                uploadedFiles.push(path)
            }
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
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

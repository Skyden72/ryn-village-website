
import { NextRequest, NextResponse } from 'next/server'
import { parseSendGridRequest } from '@/lib/mail/parse-utils'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const email = await parseSendGridRequest(formData)

        // 1. Validate Sender (Security)
        // Only allow emails from admins or whitelist
        const allowedDomain = 'rynvillage.co.za' // Modify as needed
        /* 
        if (!email.from.includes(allowedDomain)) {
            console.warn(`Blocked email from unauthorized sender: ${email.from}`)
            return NextResponse.json({ error: 'Unauthorized sender' }, { status: 403 })
        }
        */

        // 2. Initialize Supabase Admin Client
        // We need service role key to write to storage/db without user session
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const uploadedFiles = []

        // 3. Process Attachments
        for (const attachment of email.attachments) {
            if (attachment.contentType === 'application/pdf') {
                const timestamp = Date.now()
                const safeFilename = attachment.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
                const path = `uploads/${timestamp}_${safeFilename}`

                // Upload to Storage
                const { error: uploadError } = await supabaseAdmin
                    .storage
                    .from('admin-uploads') // Ensure this bucket exists!
                    .upload(path, attachment.content, {
                        contentType: 'application/pdf',
                        upsert: false
                    })

                if (uploadError) {
                    console.error('Upload failed:', uploadError)
                    continue
                }

                // Create Database Record
                const { error: dbError } = await supabaseAdmin
                    .from('documents')
                    .insert({
                        filename: attachment.filename,
                        file_path: path,
                        content_type: attachment.contentType,
                        file_size: attachment.size,
                        source: 'email',
                        sender_email: email.from,
                    })

                if (dbError) {
                    console.error('Database insert failed:', dbError)
                } else {
                    uploadedFiles.push(path)
                }
            }
        }

        return NextResponse.json({
            success: true,
            filesProcessed: uploadedFiles.length,
            message: 'Email processed successfully'
        })

    } catch (error: any) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}

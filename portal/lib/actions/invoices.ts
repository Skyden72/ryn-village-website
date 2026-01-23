'use server'

import { parseBulkPdf, extractInvoiceData } from '../invoices/parse'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type UploadResult = {
    success: boolean
    message: string
    stats?: {
        total: number
        processed: number
        failed: number
        errors: string[]
    }
}

export async function uploadInvoices(prevState: UploadResult, formData: FormData): Promise<UploadResult> {
    const file = formData.get('file') as File
    if (!file) {
        return { success: false, message: 'No file provided' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    try {
        // 1. Parse text from all pages
        const textPages = await parseBulkPdf(buffer)
        const totalPages = textPages.length

        const supabase = await createClient()
        const errors: string[] = []
        let processed = 0

        // 2. Upload the FULL PDF once
        // Generate a unique filename based on timestamp
        const timestamp = new Date().toISOString().split('T')[0]
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const fullPdfPath = `bulk/${timestamp}_${sanitizedName}`

        const { error: uploadError } = await supabase.storage
            .from('invoices')
            .upload(fullPdfPath, buffer, {
                contentType: 'application/pdf',
                upsert: true
            })

        if (uploadError) {
            return {
                success: false,
                message: `Failed to upload PDF: ${uploadError.message}`
            }
        }

        // 3. Process each page as a bill record
        for (let i = 0; i < totalPages; i++) {
            const text = textPages[i]
            const data = extractInvoiceData(text)

            if (!data.invoiceNumber || !data.unitNumber || !data.totalAmount || !data.date) {
                errors.push(`Page ${i + 1}: Missing data (Inv:${data.invoiceNumber}, Unit:${data.unitNumber})`)
                continue
            }

            // 4. Find Resident with fuzzy matching
            const unitClean = data.unitNumber.replace(/Unit\s+/i, '')
            const variants = [
                data.unitNumber,
                `RV${unitClean}`,
                `RV0${unitClean}`,
                `RV00${unitClean}`,
                unitClean
            ]

            const uniqueVariants = [...new Set(variants)]
            const orQuery = uniqueVariants.map(v => `unit_number.eq."${v}"`).join(',')

            const { data: resident } = await supabase
                .from('residents')
                .select('id')
                .or(orQuery)
                .single()

            if (!resident) {
                errors.push(`Page ${i + 1}: Resident not found for ${data.unitNumber}`)
                continue
            }

            // 5. Parse date for DB
            const [day, month, shortYear] = data.date.split('/')
            const year = `20${shortYear}`
            const dbDate = `${year}-${month}-${day}`

            // 6. Insert Bill with page_number (1-indexed for PDF viewers)
            const { error: dbError } = await supabase
                .from('bills')
                .upsert({
                    resident_id: resident.id,
                    invoice_number: data.invoiceNumber,
                    month: dbDate,
                    amount: data.totalAmount,
                    description: `Levy Invoice ${data.invoiceNumber}`,
                    pdf_url: fullPdfPath,
                    page_number: i + 1,  // 1-indexed
                    is_paid: false
                }, {
                    onConflict: 'invoice_number'
                })

            if (dbError) {
                errors.push(`Page ${i + 1}: DB insert failed - ${dbError.message}`)
            } else {
                processed++
            }
        }

        revalidatePath('/admin/invoices')
        revalidatePath('/admin/bills')

        return {
            success: true,
            message: `Processed ${processed} of ${totalPages} invoices`,
            stats: {
                total: totalPages,
                processed,
                failed: errors.length,
                errors
            }
        }

    } catch (e: any) {
        console.error('Upload Process Error:', e)
        return { success: false, message: `System Error: ${e.message}` }
    }
}

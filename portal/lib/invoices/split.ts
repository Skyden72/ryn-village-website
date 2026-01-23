import { PDFDocument } from 'pdf-lib'

/**
 * Splits a PDF buffer into an array of single-page PDF buffers.
 * Assumes each invoice is one page long.
 */
export async function splitPdf(buffer: Buffer): Promise<Buffer[]> {
    // 1. Get total page count first
    const mainDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const pageCount = mainDoc.getPageCount()
    const documents: Buffer[] = []

    // 2. For each page, load a fresh copy of the document and remove others
    // This is less efficient but preserves all resources/fonts/forms that might be lost in a simple copy
    for (let i = 0; i < pageCount; i++) {
        const subDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })

        // We want to keep page 'i'. 
        // Remove all other pages (0 to pageCount-1, except i).
        // Remove in descending order to avoid index shifting problems.
        for (let j = pageCount - 1; j >= 0; j--) {
            if (j !== i) {
                subDoc.removePage(j)
            }
        }

        const pdfBytes = await subDoc.save()
        documents.push(Buffer.from(pdfBytes))
    }

    return documents
}

import { PDFDocument } from 'pdf-lib'
import { parseBulkPdf } from '../lib/invoices/parse'
import fs from 'fs'

async function main() {
    const filePath = 'f:\\Websites\\Ryn Village\\202512 RV Invoices & Credit notes (1).PDF';
    const buffer = fs.readFileSync(filePath);
    console.log('Original size:', buffer.length);

    // Load original
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const pageCount = pdfDoc.getPageCount()
    console.log('Pages:', pageCount)

    // Try Method 2: Load fresh for each page (Clone & Remove)
    // We only test the first page
    const subDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })

    // Remove all pages except the first one (index 0)
    // We must remove from end to start to preserve indices
    const total = subDoc.getPageCount()

    // We want to keep index 0. So remove 1 to end.
    for (let i = total - 1; i > 0; i--) {
        subDoc.removePage(i)
    }

    const savedBytes = await subDoc.save()
    console.log('Clone-Method info:');
    console.log('Page count:', subDoc.getPageCount());
    console.log('Saved size:', savedBytes.length);

    fs.writeFileSync('debug_clone_page1.pdf', Buffer.from(savedBytes));

    // Verify content
    console.log('Verifying content...');
    const result = await parseBulkPdf(Buffer.from(savedBytes));
    console.log('Content Length:', result[0].length);
    console.log('Preview:', result[0].substring(0, 100));

}

main().catch(console.error)

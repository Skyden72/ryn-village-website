import { splitPdf } from '../lib/invoices/split';
import { parseBulkPdf, extractInvoiceData } from '../lib/invoices/parse';
import fs from 'fs';

async function main() {
    const filePath = 'f:\\Websites\\Ryn Village\\202512 RV Invoices & Credit notes (1).PDF';

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    console.log('Reading file...');
    const buffer = fs.readFileSync(filePath);
    console.log(`Buffer size: ${buffer.length} bytes`);

    try {
        // Parallel execution: Split parsing and splitting
        console.log('Strating Process...');
        const [pdfPages, textPages] = await Promise.all([
            splitPdf(buffer),
            parseBulkPdf(buffer)
        ]);

        console.log(`\nSplit Results:`);
        console.log(`- PDF Pages: ${pdfPages.length}`);
        console.log(`- Text Pages: ${textPages.length}`);

        if (pdfPages.length !== textPages.length) {
            console.warn('WARNING: Page count mismatch between Splitter and Parser!');
        }

        // Debug: Save first page to check if it's blank
        if (pdfPages.length > 0) {
            fs.writeFileSync('debug_output_page1.pdf', pdfPages[0]);
            console.log('Saved debug_output_page1.pdf for inspection');

            // Verify content of the split page
            console.log('Verifying split page content...');
            const splitContent = await parseBulkPdf(pdfPages[0]);
            console.log('Split Page Content Length:', splitContent[0].length);
            console.log('Split Page Preview:', splitContent[0].substring(0, 100));
        }

        console.log('\n--- Analyzing First 5 Invoices ---');

        for (let i = 0; i < Math.min(textPages.length, 5); i++) {
            console.log(`\nInvoice ${i + 1}:`);
            try {
                const result = extractInvoiceData(textPages[i]);

                console.log('Invoice #:   ', result.invoiceNumber);
                console.log('Unit:        ', result.unitNumber);
                console.log('Date:        ', result.date);
                console.log('Total Due:   ', result.totalAmount);
                console.log('Resident:    ', result.residentName);

                // Integrity Check
                if (!result.invoiceNumber) console.warn('  [MISSING INVOICE #]');
                if (!result.unitNumber) console.warn('  [MISSING UNIT]');
                if (!result.totalAmount) console.warn('  [MISSING AMOUNT]');
            } catch (e) {
                console.error(`Error parsing page ${i + 1}:`, e);
            }
        }

    } catch (e) {
        console.error('Core Pipeline Error:', e);
    }
}

main().catch(console.error);

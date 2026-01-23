import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

export interface ParsedInvoice {
    text: string
    invoiceNumber: string | null
    unitNumber: string | null
    residentName: string | null
    date: string | null
    totalAmount: number | null
}

/**
 * Parses a SINGLE invoice text block
 */
export function extractInvoiceData(text: string): ParsedInvoice {
    // 1. Invoice Number (e.g., IN102495)
    const invoiceMatch = text.match(/IN\d+/)
    const invoiceNumber = invoiceMatch ? invoiceMatch[0] : null

    // 2. Unit Number
    let unitNumber: string | null = null
    const unitMatch = text.match(/Unit\w*\s*(\d+)/i)
    if (unitMatch) {
        unitNumber = `Unit ${unitMatch[1]}`
    } else {
        const rvMatch = text.match(/RV(\d+)/)
        if (rvMatch) {
            const num = parseInt(rvMatch[1], 10).toString()
            unitNumber = `Unit ${num}`
        }
    }

    // 3. Date
    const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{2})/)
    const date = dateMatch ? dateMatch[0] : null

    // 4. Resident Name
    let residentName: string | null = null
    const billToRegex = /Bill To:\s+([^\r\n]+)/
    const billToMatch = text.match(billToRegex)
    if (billToMatch) {
        residentName = billToMatch[1].trim()
    }

    // 5. Total Amount
    let totalAmount: number | null = null
    const moneyRegex = /(\d{1,3}(?:\s\d{3})*\.\d{2})/g
    const allAmounts = [...text.matchAll(moneyRegex)]
        .map(m => parseFloat(m[0].replace(/\s/g, '')))

    if (allAmounts.length > 0) {
        const nonZero = allAmounts.filter(a => a > 0.01)
        if (nonZero.length > 0) {
            totalAmount = nonZero[nonZero.length - 1]
        }
    }

    return {
        text: text.substring(0, 200) + '...',
        invoiceNumber,
        unitNumber,
        residentName,
        date,
        totalAmount
    }
}

/**
 * Parses a BULK PDF buffer using pdfjs-dist
 */
export async function parseBulkPdf(buffer: Buffer): Promise<string[]> {
    // Convert Buffer to Uint8Array for pdfjs
    const data = new Uint8Array(buffer)

    // Load document
    const loadingTask = pdfjs.getDocument({
        data,
        useSystemFonts: true, // Use system fonts to avoid loading external fonts
        disableFontFace: true
    })

    const doc = await loadingTask.promise
    const numPages = doc.numPages
    const allPagesText: string[] = []

    for (let i = 1; i <= numPages; i++) {
        const page = await doc.getPage(i)
        const textContent = await page.getTextContent()

        let lastY, text = ''
        for (let item of textContent.items) {
            // item is TextItem | TextStyle. TextItem has 'str' and 'transform'
            if ('str' in item) {
                if (lastY == item.transform[5] || !lastY) {
                    text += item.str + ' '
                } else {
                    text += '\n' + item.str
                }
                lastY = item.transform[5]
            }
        }
        allPagesText.push(text)
    }

    return allPagesText
}

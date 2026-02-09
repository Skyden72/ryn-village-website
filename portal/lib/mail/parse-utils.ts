
export interface EmailAttachment {
    filename: string;
    contentType: string;
    content: Buffer;
    size: number;
}

export interface ParsedEmail {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    attachments: EmailAttachment[];
}

/**
 * Helper to parse multipart/form-data from SendGrid Inbound Parse
 * SendGrid sends:
 * - 'dkim': string
 * - 'to': string
 * - 'from': string
 * - 'subject': string
 * - 'text': string
 * - 'attachments': number (count)
 * - 'attachment1': file
 * - 'attachment2': file ...
 */
export async function parseSendGridRequest(formData: FormData): Promise<ParsedEmail> {
    const from = formData.get('from') as string;
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const text = formData.get('text') as string;
    const html = formData.get('html') as string;

    const attachments: EmailAttachment[] = [];
    const attachmentCount = parseInt((formData.get('attachments') as string) || '0');

    for (let i = 1; i <= attachmentCount; i++) {
        const file = formData.get(`attachment${i}`) as File;
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({
                filename: file.name,
                contentType: file.type,
                content: buffer,
                size: file.size
            });
        }
    }

    return {
        from,
        to,
        subject,
        text,
        html,
        attachments
    };
}

/**
 * Extracts text content from a PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        // pdf-parse is a CommonJS module
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdf = require('pdf-parse');
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return '';
    }
}

/**
 * Extracts Unit Number from text (e.g. "RV025" -> "25", "RV105" -> "105")
 * Returns the CLEAN unit number (no RV prefix, no leading zeros)
 */
export function extractUnitNumber(text: string): string | null {
    // Look for pattern: RV followed by optional zeros and 1-3 digits
    // e.g. RV025, RV25, RV001
    // Also handle possible spaces: RV 025
    const match = text.match(/RV\s*0*(\d{1,3})/i);
    if (match && match[1]) {
        return match[1];
    }

    // Fallback: Check for "Unit X" pattern if RV is missing but common in invoice text
    // const unitMatch = text.match(/Unit\s*0*(\d{1,3})/i);
    // if (unitMatch && unitMatch[1]) return unitMatch[1];

    return null;
}

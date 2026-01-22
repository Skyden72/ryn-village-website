
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

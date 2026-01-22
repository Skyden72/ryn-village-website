
export type NotificationEvent = 'maintenance_created' | 'bill_paid';

interface NotificationPayload {
    title: string;
    description: string;
    residentName?: string;
    unitNumber?: string;
    metadata?: any;
}

/**
 * Sends notifications to admins.
 * Currently prints to console.
 * Future: Integrate with SendGrid/Twilio/Push.
 */
export async function notifyAdmins(event: NotificationEvent, payload: NotificationPayload) {
    // 1. Get List of Admins (Optional if broadcasting to a group email)
    // const admins = await supabase.from('admins').select('email') ...

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@rynvillage.co.za';

    console.log(`[NOTIFICATION] Event: ${event}`);
    console.log(`[NOTIFICATION] To: ${adminEmail}`);
    console.log(`[NOTIFICATION] Payload:`, JSON.stringify(payload, null, 2));

    // Example of Email sending structure (commented out)
    /*
    await sendEmail({
      to: adminEmail,
      subject: `[Admin Alert] ${payload.title}`,
      html: `
        <h1>${payload.title}</h1>
        <p>From: ${payload.residentName} (${payload.unitNumber})</p>
        <p>${payload.description}</p>
      `
    })
    */

    return true;
}

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface ContactNotificationPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * Sends an email notification to the site administrator when a visitor submits the contact form.
 */
export async function sendContactNotificationEmail(payload: ContactNotificationPayload) {
  const { name, email, message } = payload;
  const adminEmail = process.env.ADMIN_EMAIL || 'rohitmehtaddn@gmail.com';

  if (!resend) {
    console.warn('[Email Alert] RESEND_API_KEY is not defined in environment variables. Email notification skipped.');
    return { success: false, error: 'RESEND_API_KEY is missing' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: [adminEmail],
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; margin: 0; }
              .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155; }
              .header { font-size: 20px; font-weight: 700; color: #38bdf8; margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px; }
              .field { margin-bottom: 16px; }
              .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 4px; }
              .value { font-size: 16px; color: #f8fafc; word-break: break-word; }
              .message-box { background-color: #0f172a; border-radius: 8px; padding: 16px; margin-top: 12px; border: 1px solid #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #e2e8f0; }
              .footer { margin-top: 32px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #334155; padding-top: 16px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">📬 New Portfolio Message</div>
              
              <div class="field">
                <div class="label">Sender Name</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              
              <div class="field">
                <div class="label">Sender Email</div>
                <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(email)}</a></div>
              </div>
              
              <div class="field">
                <div class="label">Message Content</div>
                <div class="message-box">${escapeHtml(message)}</div>
              </div>
              
              <div class="footer">
                This email was sent automatically from your developer portfolio contact form.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to send contact notification email via Resend:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { db } from '@/lib/db';
import { SubscriptionCreatedEmail, InvoicePendingEmail } from './templates';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  template: string,
  props: any = {}
) {
  try {
    let html: string;
    
    switch (template) {
      case 'subscription_created':
        html = render(SubscriptionCreatedEmail(props));
        break;
      case 'invoice_pending':
        html = render(InvoicePendingEmail(props));
        break;
      default:
        throw new Error(`Unknown email template: ${template}`);
    }

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    // Log successful email
    await db.emailLog.create({
      data: {
        to,
        subject,
        template,
        status: 'SENT',
        metadata: { messageId: result.messageId, props }
      }
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    // Log failed email
    await db.emailLog.create({
      data: {
        to,
        subject,
        template,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { props }
      }
    });

    throw error;
  }
}
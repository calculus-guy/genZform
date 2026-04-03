import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { confirmationTemplate } from '../templates/confirmation.html';

export interface SendConfirmationOptions {
  to: string;
  subject: string;
  firstName?: string;
  formType: 'learner' | 'instructor' | 'waitlist';
}

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 465,
  secure: true,
  auth: {
    user: env.smtpUser,
    pass: env.brevoApiKey,
  },
});

export async function sendConfirmation(options: SendConfirmationOptions): Promise<void> {
  const { to, subject, firstName, formType } = options;

  const html = confirmationTemplate({
    firstName,
    formType,
    appName: env.smtpFromName,
  });

  try {
    await transporter.sendMail({
      from: `"${env.smtpFromName}" <${env.smtpFromEmail}>`,
      to,
      subject,
      html,
    });
    console.log(`[email] Confirmation sent to ${to}`);
  } catch (error) {
    console.error(`[email] Failed to send to ${to}: ${error}`);
  }
}

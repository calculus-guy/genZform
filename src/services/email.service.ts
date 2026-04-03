import { env } from '../config/env';
import { confirmationTemplate } from '../templates/confirmation.html';

export interface SendConfirmationOptions {
  to: string;
  subject: string;
  firstName?: string;
  formType: 'learner' | 'instructor' | 'waitlist';
}

export async function sendConfirmation(options: SendConfirmationOptions): Promise<void> {
  const { to, subject, firstName, formType } = options;

  const html = confirmationTemplate({
    firstName,
    formType,
    appName: env.smtpFromName,
  });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': env.brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: env.smtpFromName,
          email: env.smtpFromEmail,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    console.log(`[email] Confirmation sent to ${to} via Brevo API`);
  } catch (error) {
    console.error(`[email] Failed to send to ${to} via Brevo API: ${error}`);
  }
}

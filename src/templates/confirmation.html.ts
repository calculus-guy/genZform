export interface ConfirmationTemplateOptions {
  firstName?: string;
  formType: 'learner' | 'instructor' | 'waitlist';
  appName?: string;
}

const formTypeLabel: Record<ConfirmationTemplateOptions['formType'], string> = {
  learner: 'learner application',
  instructor: 'instructor application',
  waitlist: 'waitlist',
};

export function confirmationTemplate(options: ConfirmationTemplateOptions): string {
  const { firstName, formType, appName = 'Talent Factory' } = options;

  const greeting = firstName && firstName.trim()
    ? `Hi ${firstName.trim()},`
    : 'Hi there,';

  const label = formTypeLabel[formType];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e;padding:24px 32px;">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">${appName}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#111827;">${greeting}</p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
                Thanks for submitting your ${label}. We've received it and our team will take a look.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
                If we need anything from you, we'll reach out via the email address you provided.
              </p>
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">
                We appreciate your interest and will be in touch soon.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

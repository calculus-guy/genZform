import WaitlistEntry from '../models/WaitlistEntry.model';
import { sendConfirmation } from './email.service';
import { WaitlistInput } from '../validations/waitlist.schema';

export async function createWaitlistEntry(data: WaitlistInput) {
  const doc = new WaitlistEntry(data);
  const saved = await doc.save();

  try {
    await sendConfirmation({
      to: data.email,
      subject: "You've been added to the waitlist",
      formType: 'waitlist',
    });
  } catch (err) {
    console.error('[waitlist.service] Email error:', err);
  }

  return saved;
}

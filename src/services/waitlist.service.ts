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
      communityLink: data.role === 'learner' ? 'https://chat.whatsapp.com/HS2PcSrRIu5ERYD6zLlyEM' : undefined,
    });
  } catch (err) {
    console.error('[waitlist.service] Email error:', err);
  }

  return saved;
}

import LearnerApplication from '../models/LearnerApplication.model';
import { sendConfirmation } from './email.service';
import { LearnerInput } from '../validations/learner.schema';

export async function createLearner(data: LearnerInput) {
  const doc = new LearnerApplication(data);
  const saved = await doc.save();

  try {
    await sendConfirmation({
      to: data.email,
      subject: "We've received your learner application",
      firstName: data.firstName,
      formType: 'learner',
    });
  } catch (err) {
    console.error('[learner.service] Email error:', err);
  }

  return saved;
}

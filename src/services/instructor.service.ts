import InstructorApplication from '../models/InstructorApplication.model';
import { sendConfirmation } from './email.service';
import { InstructorInput } from '../validations/instructor.schema';

export async function createInstructor(data: InstructorInput) {
  const doc = new InstructorApplication(data);
  const saved = await doc.save();

  try {
    await sendConfirmation({
      to: data.email,
      subject: "We've received your instructor application",
      firstName: data.firstName,
      formType: 'instructor',
    });
  } catch (err) {
    console.error('[instructor.service] Email error:', err);
  }

  return saved;
}

import dotenv from 'dotenv';
dotenv.config();

import { sendConfirmation } from '../src/services/email.service';

// ── Config ────────────────────────────────────────────────────────────────────
const TEST_TO      = process.env.TEST_EMAIL ?? 'sakariyauabdullateef993@gmail.com';
const FORM_TYPE    = (process.argv[2] as 'learner' | 'instructor' | 'waitlist') ?? 'learner';
const FIRST_NAME   = 'Test User';
// ─────────────────────────────────────────────────────────────────────────────

const subjects: Record<string, string> = {
  learner:    'Thanks for applying as a Learner',
  instructor: 'Thanks for applying as an Instructor',
  waitlist:   'You are on the Waitlist',
};

(async () => {
  console.log(`Sending test email to ${TEST_TO} (formType: ${FORM_TYPE}) …`);

  await sendConfirmation({
    to:        TEST_TO,
    subject:   subjects[FORM_TYPE] ?? subjects.learner,
    firstName: FIRST_NAME,
    formType:  FORM_TYPE,
  });

  console.log('Done.');
})();

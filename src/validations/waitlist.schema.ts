import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  role: z.enum(['learner', 'tutor', 'company', 'other'], {
    errorMap: () => ({ message: 'Role must be one of: learner, tutor, company, other' }),
  }),
  source: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

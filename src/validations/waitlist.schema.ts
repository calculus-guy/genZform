import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  source: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

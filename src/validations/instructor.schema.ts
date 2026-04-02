import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const instructorSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: optionalString,
  proTitle: optionalString,
  employer: optionalString,
  industry: optionalString,
  linkedin: optionalString,
  state: optionalString,
  referral: optionalString,
  totalYears: optionalString,
  hrYears: optionalString,
  seniority: optionalString,
  notableOrgs: optionalString,
  achievement: optionalString,
  topModule: optionalString,
  taughtBefore: optionalString,
  teachingApproach: optionalString,
  confidence: optionalString,
  sessionCount: optionalString,
  bankName: optionalString,
  accountName: optionalString,
  accountNumber: optionalString,
  whyTeach: optionalString,
  wishKnown: optionalString,
  bio: optionalString,
  additionalInfo: optionalString,
  certs: z.array(z.string()).optional(),
  teachModules: z.array(z.string()).optional(),
  timeSlots: z.array(z.string()).optional(),
});

export type InstructorInput = z.infer<typeof instructorSchema>;

import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const learnerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  phone: optionalString,
  state: optionalString,
  gender: optionalString,
  ageRange: optionalString,
  referral: optionalString,
  education: optionalString,
  fieldOfStudy: optionalString,
  employment: optionalString,
  jobTitle: optionalString,
  industry: optionalString,
  hrExp: optionalString,
  linkedin: optionalString,
  applyReason: optionalString,
  whyJoin: optionalString,
  twoYears: optionalString,
  biggestChallenge: optionalString,
  schedule: optionalString,
  internIndustry: optionalString,
  hrKnowledge: optionalString,
  referredBy: optionalString,
  payment: optionalString,
  techAccess: optionalString,
  additionalInfo: optionalString,
  type: optionalString,
  modules: z.array(z.string()).optional(),
});

export type LearnerInput = z.infer<typeof learnerSchema>;

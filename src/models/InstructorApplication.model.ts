import { Schema, model, Document } from "mongoose";

export interface IInstructorApplication extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  proTitle?: string;
  employer?: string;
  industry?: string;
  linkedin?: string;
  state?: string;
  referral?: string;
  totalYears?: string;
  hrYears?: string;
  seniority?: string;
  notableOrgs?: string;
  certs?: string[];
  achievement?: string;
  topModule?: string;
  taughtBefore?: string;
  teachingApproach?: string;
  confidence?: string;
  sessionCount?: string;
  teachModules?: string[];
  timeSlots?: string[];
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  whyTeach?: string;
  wishKnown?: string;
  bio?: string;
  additionalInfo?: string;
}

const InstructorApplicationSchema = new Schema<IInstructorApplication>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    proTitle: { type: String },
    employer: { type: String },
    industry: { type: String },
    linkedin: { type: String },
    state: { type: String },
    referral: { type: String },
    totalYears: { type: String },
    hrYears: { type: String },
    seniority: { type: String },
    notableOrgs: { type: String },
    certs: { type: [String] },
    achievement: { type: String },
    topModule: { type: String },
    taughtBefore: { type: String },
    teachingApproach: { type: String },
    confidence: { type: String },
    sessionCount: { type: String },
    teachModules: { type: [String] },
    timeSlots: { type: [String] },
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    whyTeach: { type: String },
    wishKnown: { type: String },
    bio: { type: String },
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

export default model<IInstructorApplication>(
  "InstructorApplication",
  InstructorApplicationSchema
);

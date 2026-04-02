import { Schema, model, Document } from "mongoose";

export interface ILearnerApplication extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  state?: string;
  gender?: string;
  ageRange?: string;
  referral?: string;
  education?: string;
  fieldOfStudy?: string;
  employment?: string;
  jobTitle?: string;
  industry?: string;
  hrExp?: string;
  linkedin?: string;
  applyReason?: string;
  whyJoin?: string;
  twoYears?: string;
  biggestChallenge?: string;
  schedule?: string;
  internIndustry?: string;
  hrKnowledge?: string;
  referredBy?: string;
  payment?: string;
  techAccess?: string;
  additionalInfo?: string;
  modules?: string[];
  type?: string;
}

const LearnerApplicationSchema = new Schema<ILearnerApplication>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    state: { type: String },
    gender: { type: String },
    ageRange: { type: String },
    referral: { type: String },
    education: { type: String },
    fieldOfStudy: { type: String },
    employment: { type: String },
    jobTitle: { type: String },
    industry: { type: String },
    hrExp: { type: String },
    linkedin: { type: String },
    applyReason: { type: String },
    whyJoin: { type: String },
    twoYears: { type: String },
    biggestChallenge: { type: String },
    schedule: { type: String },
    internIndustry: { type: String },
    hrKnowledge: { type: String },
    referredBy: { type: String },
    payment: { type: String },
    techAccess: { type: String },
    additionalInfo: { type: String },
    modules: { type: [String] },
    type: { type: String },
  },
  { timestamps: true }
);

export default model<ILearnerApplication>(
  "LearnerApplication",
  LearnerApplicationSchema
);

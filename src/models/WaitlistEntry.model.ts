import { Schema, model, Document } from "mongoose";

export type WaitlistRole = 'learner' | 'tutor' | 'company' | 'other';

export interface IWaitlistEntry extends Document {
  email: string;
  role: WaitlistRole;
  source?: string;
}

const WaitlistEntrySchema = new Schema<IWaitlistEntry>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['learner', 'tutor', 'company', 'other'], required: true },
    source: { type: String },
  },
  { timestamps: true }
);

export default model<IWaitlistEntry>("WaitlistEntry", WaitlistEntrySchema);

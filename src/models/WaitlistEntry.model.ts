import { Schema, model, Document } from "mongoose";

export interface IWaitlistEntry extends Document {
  email: string;
  source?: string;
}

const WaitlistEntrySchema = new Schema<IWaitlistEntry>(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String },
  },
  { timestamps: true }
);

export default model<IWaitlistEntry>("WaitlistEntry", WaitlistEntrySchema);

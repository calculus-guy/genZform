import { Schema, model, Document } from "mongoose";

export interface IAdminUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    role: { type: String, required: true, default: "admin" },
  },
  { timestamps: true }
);

export default model<IAdminUser>("AdminUser", AdminUserSchema);

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.model";
import LearnerApplication from "../models/LearnerApplication.model";
import InstructorApplication from "../models/InstructorApplication.model";
import WaitlistEntry from "../models/WaitlistEntry.model";
import AppError from "../utils/AppError";
import { env } from "../config/env";

interface PaginatedQuery {
  page?: number;
  limit?: number;
  email?: string;
  name?: string;
  role?: string;
}

interface PaginatedResult<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
}

export async function login(email: string, password: string) {
  const admin = await AdminUser.findOne({ email }).select("+password");

  if (!admin) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as any }
  );

  return {
    token,
    admin: { name: admin.name, email: admin.email, role: admin.role },
  };
}

export async function getDashboard() {
  const [
    totalLearners,
    totalInstructors,
    totalWaitlist,
    recentLearners,
    recentInstructors,
    recentWaitlist,
  ] = await Promise.all([
    LearnerApplication.countDocuments(),
    InstructorApplication.countDocuments(),
    WaitlistEntry.countDocuments(),
    LearnerApplication.find().sort({ createdAt: -1 }).limit(5).lean(),
    InstructorApplication.find().sort({ createdAt: -1 }).limit(5).lean(),
    WaitlistEntry.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalLearners,
    totalInstructors,
    totalWaitlist,
    recentLearners,
    recentInstructors,
    recentWaitlist,
  };
}

export async function getRecords<T>(
  model: any,
  query: PaginatedQuery
): Promise<PaginatedResult<T>> {
  const page = query.page || 1;
  const limit = query.limit || 20;

  const filter: any = {};

  if (query.email && query.name) {
    const nameRegex = { $regex: query.name, $options: "i" };
    filter.$and = [
      { email: { $regex: query.email, $options: "i" } },
      { $or: [{ firstName: nameRegex }, { lastName: nameRegex }] },
    ];
  } else if (query.email) {
    filter.email = { $regex: query.email, $options: "i" };
  } else if (query.name) {
    const nameRegex = { $regex: query.name, $options: "i" };
    filter.$or = [{ firstName: nameRegex }, { lastName: nameRegex }];
  }

  if (query.role) {
    filter.role = query.role;
  }

  const [total, records] = await Promise.all([
    model.countDocuments(filter),
    model
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return { records, total, page, limit };
}

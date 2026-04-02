import bcrypt from "bcryptjs";
import AdminUser from "../models/AdminUser.model";
import { env } from "../config/env";

export async function seedAdmin(): Promise<void> {
  try {
    const existing = await AdminUser.findOne();

    if (existing) {
      console.log("[seeder] Admin user already exists, skipping seed");
      return;
    }

    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

    await AdminUser.create({
      email: env.adminEmail,
      name: env.adminName,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`[seeder] Admin user created: ${env.adminEmail}`);
  } catch (error) {
    console.error("[seeder] Error seeding admin user:", error);
  }
}

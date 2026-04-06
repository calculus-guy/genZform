import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import * as adminService from "../services/admin.service";
import LearnerApplication from "../models/LearnerApplication.model";
import InstructorApplication from "../models/InstructorApplication.model";
import WaitlistEntry from "../models/WaitlistEntry.model";

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.login(req.body.email, req.body.password);
  return res.status(200).json({ success: true, token: result.token, admin: result.admin });
});

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getDashboard();
  return successResponse(res, 200, "Dashboard data", data);
});

export const getLearners = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    email: req.query.email as string | undefined,
    name: req.query.name as string | undefined,
  };
  const data = await adminService.getRecords(LearnerApplication, query);
  return successResponse(res, 200, "Learner records", data);
});

export const getInstructors = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    email: req.query.email as string | undefined,
    name: req.query.name as string | undefined,
  };
  const data = await adminService.getRecords(InstructorApplication, query);
  return successResponse(res, 200, "Instructor records", data);
});

export const getWaitlist = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    email: req.query.email as string | undefined,
    role: req.query.role as string | undefined,
  };
  const data = await adminService.getRecords(WaitlistEntry, query);
  return successResponse(res, 200, "Waitlist records", data);
});

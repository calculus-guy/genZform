import { Router } from "express";
import { validate } from "../validations/validate.middleware";
import { adminLoginSchema } from "../validations/admin.schema";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  adminLogin,
  getDashboard,
  getLearners,
  getInstructors,
  getWaitlist,
} from "../controllers/admin.controller";

const router = Router();

router.post("/login", validate(adminLoginSchema), adminLogin);
router.get("/dashboard", authMiddleware, getDashboard);
router.get("/learners", authMiddleware, getLearners);
router.get("/instructors", authMiddleware, getInstructors);
router.get("/waitlist", authMiddleware, getWaitlist);

export default router;

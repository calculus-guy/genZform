import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { createWaitlistEntry } from '../services/waitlist.service';

export const submitWaitlist = asyncHandler(async (req, res) => {
  const result = await createWaitlistEntry(req.body);
  return successResponse(res, 201, "You've been added to the waitlist", result);
});

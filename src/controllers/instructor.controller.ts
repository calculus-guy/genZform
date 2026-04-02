import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { createInstructor } from '../services/instructor.service';

export const submitInstructor = asyncHandler(async (req, res) => {
  const result = await createInstructor(req.body);
  return successResponse(res, 201, 'Instructor application submitted successfully', result);
});

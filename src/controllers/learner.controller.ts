import asyncHandler from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { createLearner } from '../services/learner.service';

export const submitLearner = asyncHandler(async (req, res) => {
  const result = await createLearner(req.body);
  return successResponse(res, 201, 'Learner application submitted successfully', result);
});

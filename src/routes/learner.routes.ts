import { Router } from 'express';
import { validate } from '../validations/validate.middleware';
import { learnerSchema } from '../validations/learner.schema';
import { submitLearner } from '../controllers/learner.controller';

const router = Router();

router.post('/', validate(learnerSchema), submitLearner);

export default router;

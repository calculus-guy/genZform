import { Router } from 'express';
import { validate } from '../validations/validate.middleware';
import { instructorSchema } from '../validations/instructor.schema';
import { submitInstructor } from '../controllers/instructor.controller';

const router = Router();

router.post('/', validate(instructorSchema), submitInstructor);

export default router;

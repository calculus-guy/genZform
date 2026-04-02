import { Router } from 'express';
import { validate } from '../validations/validate.middleware';
import { waitlistSchema } from '../validations/waitlist.schema';
import { submitWaitlist } from '../controllers/waitlist.controller';

const router = Router();

router.post('/', validate(waitlistSchema), submitWaitlist);

export default router;

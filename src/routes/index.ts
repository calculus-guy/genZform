import { Router } from 'express';
import learnerRouter from './learner.routes';
import instructorRouter from './instructor.routes';
import waitlistRouter from './waitlist.routes';
import adminRouter from './admin.routes';

const router = Router();

router.use('/api/learners', learnerRouter);
router.use('/api/instructors', instructorRouter);
router.use('/api/waitlist', waitlistRouter);
router.use('/api/admin', adminRouter);

export default router;

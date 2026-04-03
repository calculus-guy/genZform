import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env';
import router from './routes/index';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

const app = express();

if (env.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(helmet());
app.use(cors({
  origin: ['https://Tf.thegenzhr.com', 'https://talentfactory.netlify.app', 'http://localhost:5000'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const postRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use((req, res, next) => {
  if (req.method === 'POST') return postRateLimiter(req, res, next);
  next();
});

app.use('/', router);
app.use(notFound);
app.use(errorHandler);

export default app;

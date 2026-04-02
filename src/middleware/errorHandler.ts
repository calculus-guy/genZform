import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import AppError from '../utils/AppError';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
  stack?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const isProduction = env.nodeEnv === 'production';

  // 1. AppError (operational)
  if (err instanceof AppError && err.isOperational) {
    const body: ErrorResponse = { success: false, message: err.message };
    if (err.errors) body.errors = err.errors;
    res.status(err.statusCode).json(body);
    return;
  }

  // 2. Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  // 3. Mongoose CastError
  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: `Invalid value for field: ${err.path}` });
    return;
  }

  // 4. Mongoose duplicate key
  if (err.code === 11000) {
    res.status(409).json({ success: false, message: 'A record with this email already exists' });
    return;
  }

  // 5. JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  // 6. TokenExpiredError
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  // 7. Unknown errors
  const message = isProduction ? 'Something went wrong' : err.message;
  const body: ErrorResponse = { success: false, message };
  if (!isProduction) body.stack = err.stack;
  res.status(500).json(body);
};

export default errorHandler;

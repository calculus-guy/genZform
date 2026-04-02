import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import AppError from '../utils/AppError';

export function validate(schema: ZodSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const err = new AppError('Validation error', 400);
      (err as any).errors = errors;
      return next(err);
    }

    req.body = result.data;
    return next();
  };
}

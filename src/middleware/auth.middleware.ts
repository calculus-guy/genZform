import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../utils/AppError";
import { env } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      admin?: { email: string; name: string; role: string; id: string };
    }
  }
}

export const authMiddleware: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    req.admin = { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role };
    return next();
  } catch (err) {
    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      return next(new AppError("Unauthorized", 401));
    }
    return next(err);
  }
};

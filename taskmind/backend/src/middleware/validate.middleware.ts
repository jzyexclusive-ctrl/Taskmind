import { Request, Response, NextFunction } from 'express';
import { ZodError, AnyZodObject } from 'zod';
import { ApiResponse } from '../utils/response.js';

export const validate = (schema: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        const parsed = schema.query.parse(req.query);
        Object.assign(req.query, parsed);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        ApiResponse.error(res, 'Validation failed', 400, errors);
      } else {
        next(error as any);
      }
    }
  };
};

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // 1. Operational Errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors ? { errors: err.errors } : {}),
        });
        return;
    }

    // 2. Prisma Database Errors
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const target = (err.meta?.target as string[]) || ['field'];
            res.status(409).json({
                success: false,
                message: `A record with this ${target.join(', ')} already exists.`,
            });
            return;
        }

        if (err.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Record not found.',
            });
            return;
        }
    }

    // 3. Unexpected Server Errors
    console.error('🔥 Unexpected Server Error:', err);
    res.status(500).json({
        success: false,
        message: (process.env.NODE_ENV ?? 'development') === 'production'
            ? 'Internal server error'
            : err.message,
    });
};
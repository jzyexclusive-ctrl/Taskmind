import { Response } from 'express';

export class ApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: number = 200
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static error(
        res: Response,
        message: string = 'Internal Server Error',
        statusCode: number = 500,
        errors: unknown = null
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors ? { errors } : {}),
        });
    }
}
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HealthController {
    static check(_req: Request, res: Response): void {
        res.json({
            success: true,
            message: 'API is healthy',
            timestamp: new Date().toISOString(),
        });
    }

    static async checkDatabase(_req: Request, res: Response): Promise<void> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            res.json({
                success: true,
                message: 'Database connection is healthy',
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            res.status(503).json({
                success: false,
                message: 'Database connection failed',
                timestamp: new Date().toISOString(),
            });
        }
    }
}

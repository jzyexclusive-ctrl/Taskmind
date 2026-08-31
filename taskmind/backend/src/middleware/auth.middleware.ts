import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    const payload = JwtUtil.verifyToken(token);
    req.user = { userId: payload.userId };

    next();
}

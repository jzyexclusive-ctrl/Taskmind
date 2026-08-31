import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors.js';

export interface TokenPayload {
    userId: number;
    email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_taskmind';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class JwtUtil {
    static generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        } as jwt.SignOptions);
    }

    static verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired authentication token');
        }
    }
}
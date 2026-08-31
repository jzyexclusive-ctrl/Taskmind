import { prisma } from '../lib/prisma.js';
import { PasswordUtil } from '../utils/password.js';
import { JwtUtil } from '../utils/jwt.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';

export class AuthService {
    static async register(input: RegisterInput) {
        const { name, email, password } = input;

        // Block duplicate emails
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (existingUser) {
            throw new ConflictError('An account with this email address already exists');
        }

        const passwordHash = await PasswordUtil.hash(password);

        const user = await prisma.user.create({
            data: { name, email: email.toLowerCase(), passwordHash },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        const token = JwtUtil.generateToken({ userId: user.id, email: user.email });
        return { user, token };
    }

    static async login(input: LoginInput) {
        const { email, password } = input;

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Same error message for both "user not found" & "wrong password" — security best practice
        if (!user) throw new UnauthorizedError('Invalid email or password');

        const isPasswordValid = await PasswordUtil.compare(password, user.passwordHash);
        if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

        const token = JwtUtil.generateToken({ userId: user.id, email: user.email });
        return {
            user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
            token,
        };
    }

    static async getCurrentUser(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, createdAt: true, updatedAt: true,
                _count: { select: { tasks: true } },
            },
        });
        if (!user) throw new NotFoundError('User profile not found');
        return user;
    }
}
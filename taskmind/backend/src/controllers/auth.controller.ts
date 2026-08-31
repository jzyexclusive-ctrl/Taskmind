import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/response.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const result = await AuthService.register(req.body);
    ApiResponse.success(res, result, 'User registered successfully', 201);
  }

  static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.login(req.body);
    ApiResponse.success(res, result, 'Login successful', 200);
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const user = await AuthService.getCurrentUser(userId);
    ApiResponse.success(res, { user }, 'User profile retrieved successfully', 200);
  }
}

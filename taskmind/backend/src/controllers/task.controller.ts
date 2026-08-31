import { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';
import { ApiResponse } from '../utils/response.js';
import { TaskStatus } from '@prisma/client';

export class TaskController {
    // GET /api/v1/tasks
    static async getTasks(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const result = await TaskService.getUserTasks(userId, req.query as any);
        ApiResponse.success(res, result, 'Tasks retrieved successfully');
    }

    // POST /api/v1/tasks
    static async createTask(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const task = await TaskService.createTask(userId, req.body);
        ApiResponse.success(res, { task }, 'Task created successfully', 201);
    }

    // GET /api/v1/tasks/:id
    static async getTaskById(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const taskId = parseInt(req.params.id as string, 10);
        const task = await TaskService.getTaskById(taskId, userId);
        ApiResponse.success(res, { task }, 'Task retrieved successfully');
    }

    // PUT /api/v1/tasks/:id
    static async updateTask(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const taskId = parseInt(req.params.id as string, 10);
        const updatedTask = await TaskService.updateTask(taskId, userId, req.body);
        ApiResponse.success(res, { task: updatedTask }, 'Task updated successfully');
    }

    // PATCH /api/v1/tasks/:id/status
    static async updateStatus(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const taskId = parseInt(req.params.id as string, 10);
        const { status } = req.body as { status: TaskStatus };
        const updatedTask = await TaskService.updateTaskStatus(taskId, userId, status);
        ApiResponse.success(res, { task: updatedTask }, 'Task status updated successfully');
    }

    // DELETE /api/v1/tasks/:id
    static async deleteTask(req: Request, res: Response): Promise<void> {
        const userId = req.user!.userId;
        const taskId = parseInt(req.params.id as string, 10);
        const result = await TaskService.deleteTask(taskId, userId);
        ApiResponse.success(res, result, 'Task deleted successfully');
    }
}
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator.js';
import { TaskStatus, TaskPriority, Prisma } from '@prisma/client';

export interface TaskQueryParams {
    status?: TaskStatus;
    priority?: TaskPriority;
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
    order?: 'asc' | 'desc';
}

export class TaskService {
    /**
     * 1. Get all tasks for the authenticated user with filtering, search & pagination
     */
    static async getUserTasks(userId: number, query: TaskQueryParams) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;

        const sortBy = query.sortBy || 'createdAt';
        const order = query.order || 'desc';

        // Build dynamic Prisma WHERE filter scoped strictly to this user
        const where: Prisma.TaskWhereInput = {
            userId: userId,
            ...(query.status && { status: query.status }),
            ...(query.priority && { priority: query.priority }),
            ...(query.category && { category: { equals: query.category, mode: 'insensitive' } }),
            ...(query.search && {
                OR: [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ],
            }),
        };

        // Run count and fetch queries concurrently in a single database transaction
        const [totalTasks, tasks] = await prisma.$transaction([
            prisma.task.count({ where }),
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
        ]);

        return {
            tasks,
            pagination: {
                total: totalTasks,
                page,
                limit,
                totalPages: Math.ceil(totalTasks / limit) || 1,
            },
        };
    }

    /**
     * 2. Create a new task tied strictly to the authenticated user
     */
    static async createTask(userId: number, input: CreateTaskInput) {
        return prisma.task.create({
            data: {
                userId,
                title: input.title,
                description: input.description ?? null,
                status: input.status,
                priority: input.priority,
                dueDate: input.dueDate ? new Date(input.dueDate) : null,
            },
        });
    }

    /**
     * 3. Get single task by ID with strict ownership validation
     */
    static async getTaskById(taskId: number, userId: number) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new NotFoundError('Task not found');
        }

        // Ownership check
        if (task.userId !== userId) {
            throw new ForbiddenError('You do not have permission to access this task');
        }

        return task;
    }

    /**
     * 4. Update task with ownership verification
     */
    static async updateTask(taskId: number, userId: number, input: UpdateTaskInput) {
        // First, verify existence and ownership
        await this.getTaskById(taskId, userId);

        return prisma.task.update({
            where: { id: taskId },
            data: {
                ...(input.title !== undefined && { title: input.title }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.status !== undefined && { status: input.status }),
                ...(input.priority !== undefined && { priority: input.priority }),
                ...(input.dueDate !== undefined && {
                    dueDate: input.dueDate ? new Date(input.dueDate) : null,
                }),
            },
        });
    }

    /**
     * 5. Toggle / Patch Task Status
     */
    static async updateTaskStatus(taskId: number, userId: number, status: TaskStatus) {
        await this.getTaskById(taskId, userId);

        return prisma.task.update({
            where: { id: taskId },
            data: { status },
        });
    }

    /**
     * 6. Delete task with ownership verification
     */
    static async deleteTask(taskId: number, userId: number) {
        await this.getTaskById(taskId, userId);

        await prisma.task.delete({
            where: { id: taskId },
        });

        return { message: 'Task deleted successfully' };
    }
}
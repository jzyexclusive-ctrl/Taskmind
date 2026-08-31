import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const getTaskParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, 'Task ID must be a number'),
});

export const taskQuerySchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
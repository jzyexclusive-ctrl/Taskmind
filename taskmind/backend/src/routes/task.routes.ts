import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createTaskSchema,
    updateTaskSchema,
    getTaskParamsSchema,
    taskQuerySchema,
} from '../validators/task.validator.js';

const router = Router();

// Protect ALL task routes with JWT Authentication
router.use(requireAuth);

// Routes
router.get('/', validate({ query: taskQuerySchema }), TaskController.getTasks);
router.post('/', validate({ body: createTaskSchema }), TaskController.createTask);
router.get('/:id', validate({ params: getTaskParamsSchema }), TaskController.getTaskById);
router.put('/:id', validate({ body: updateTaskSchema }), TaskController.updateTask);
router.patch('/:id/status', validate({ params: getTaskParamsSchema }), TaskController.updateStatus);
router.delete('/:id', validate({ params: getTaskParamsSchema }), TaskController.deleteTask);

export default router;
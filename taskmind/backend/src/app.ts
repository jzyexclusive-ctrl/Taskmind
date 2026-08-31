import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/index.js';
import { ApiResponse } from './utils/response.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

const app: Application = express();

// 1. HTTP Security Headers (helmet = security guard)
app.use(helmet());

// 2. CORS (who is allowed to talk to our server)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// 3. Body Parser (limit 10kb = blocks massive payload attacks)
app.use(express.json({ limit: '10kb' }));

// 4. Rate Limiting (bouncer for all API routes)
app.use('/api', apiLimiter);

// 5. API Routes
app.use('/api/v1', apiRoutes);

// 6. 404 Handler
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

// 7. Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;

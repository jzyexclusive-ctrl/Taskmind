export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;

  constructor(message: string, statusCode: number = 400, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', errors?: unknown) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden - You do not own this resource') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Requested resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}
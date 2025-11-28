export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class WineNotFoundError extends AppError {
  constructor(id: string) {
    super(`Wine with ID ${id} not found`, 'WINE_NOT_FOUND', 404);
  }
}

export class ComboNotFoundError extends AppError {
  constructor(id: string) {
    super(`Combo with ID ${id} not found`, 'COMBO_NOT_FOUND', 404);
  }
}

export class OrderNotFoundError extends AppError {
  constructor(id: string) {
    super(`Order with ID ${id} not found`, 'ORDER_NOT_FOUND', 404);
  }
}

export class FirestoreError extends AppError {
  constructor(message: string, originalError?: unknown) {
    super(
      `Firestore error: ${message}`,
      'FIRESTORE_ERROR',
      500,
      originalError
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public validationDetails?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, validationDetails);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}


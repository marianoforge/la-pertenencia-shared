

import { NextApiResponse } from 'next';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: unknown;
}

export function sendSuccess<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(
  res: NextApiResponse<ApiResponse>,
  error: unknown,
  defaultMessage: string = 'Internal server error'
) {
  if (error instanceof AppError) {
    logger.error('API Error', { message: error.message, code: error.code, details: error.details });
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
    });
  }

  logger.error('Unexpected API Error', error);
  return res.status(500).json({
    success: false,
    error: defaultMessage,
    code: 'INTERNAL_ERROR',
  });
}


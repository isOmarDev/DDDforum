import type { Request, Response, NextFunction } from 'express';

import { InvalidRequestBodyException } from './exceptions';
import { ErrorException } from './error-exception-types';
import type { ApiResponse, GenericErrors } from '@dddforum/shared/types';

export type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

class GlobalErrorHandler {
  static handle(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    let responseBody: ApiResponse<undefined, GenericErrors>;

    if (error instanceof InvalidRequestBodyException) {
      responseBody = {
        success: false,
        data: undefined,
        error: { code: ErrorException.ValidationError, message: error.message },
      };

      return res.status(400).json(responseBody);
    }

    responseBody = {
      success: false,
      data: undefined,
      error: { code: ErrorException.ServerError, message: error.message },
    };

    return res.status(500).json(responseBody);
  }
}

export default GlobalErrorHandler;

import type { Request, Response, NextFunction } from 'express';

import {
  InvalidRequestBodyException,
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
  EmailNotAddedToMailListException,
} from './exceptions';
import { ErrorException } from './error-exception-types';

class ErrorExceptionHandler {
  static handle(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof InvalidRequestBodyException) {
      return res.status(400).json({
        success: false,
        data: undefined,
        error: { code: ErrorException.ValidationError, message: error.message },
      });
    }

    if (error instanceof EmailAlreadyInUseException) {
      return res.status(409).json({
        success: false,
        data: undefined,
        error: {
          code: ErrorException.EmailAlreadyInUse,
          message: error.message,
        },
      });
    }

    if (error instanceof UsernameAlreadyTakenException) {
      return res.status(409).json({
        success: false,
        data: undefined,
        error: {
          code: ErrorException.UsernameAlreadyTaken,
          message: error.message,
        },
      });
    }

    if (error instanceof EmailNotAddedToMailListException) {
      return res.status(400).json({
        success: false,
        data: undefined,
        error: {
          code: ErrorException.EmailNotAddedToMailList,
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      data: undefined,
      error: { code: ErrorException.ServerError, message: error.message },
    });
  }
}

export default ErrorExceptionHandler;

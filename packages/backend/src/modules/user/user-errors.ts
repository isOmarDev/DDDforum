import type { Request, Response, NextFunction } from 'express';
import {
  EmailAlreadyInUseException,
  UsernameAlreadyTakenException,
} from './user-exceptions';
import { UserResponse } from '@dddforum/shared/types/users';

export const userErrorCodes = {
  EmailAlreadyInUse: 'EmailAlreadyInUse',
  UsernameAlreadyTaken: 'UsernameAlreadyTaken',
} as const;

export class UserErrors {
  static handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let responseBody: UserResponse;

    if (error instanceof EmailAlreadyInUseException) {
      responseBody = {
        success: false,
        data: undefined,
        error: {
          code: 'EmailAlreadyInUse',
          message: error.message,
        },
      };

      return res.status(409).json(responseBody);
    }

    if (error instanceof UsernameAlreadyTakenException) {
      responseBody = {
        success: false,
        data: undefined,
        error: {
          code: 'UsernameAlreadyTaken',
          message: error.message,
        },
      };

      return res.status(409).json(responseBody);
    }

    next(error);
  }
}

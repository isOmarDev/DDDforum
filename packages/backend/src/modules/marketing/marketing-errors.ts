import type { Request, Response, NextFunction } from 'express';

import { EmailNotAddedToMailListException } from './marketing-exceptions';
import { MarketingResponse } from '@dddforum/shared/api/marketing';

export const marketingErrorCodes = {
  EmailNotAddedToMailList: 'EmailNotAddedToMailList',
} as const;

export class MarketingErrors {
  static handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let responseBody: MarketingResponse;

    if (error instanceof EmailNotAddedToMailListException) {
      responseBody = {
        success: false,
        data: null,
        error: {
          code: 'EmailNotAddedToMailList',
          message: error.message,
        },
      };

      return res.status(400).json(responseBody);
    }

    next(error);
  }
}

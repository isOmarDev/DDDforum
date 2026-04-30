import type { Request, Response, NextFunction } from 'express';

export class PostErrors {
  static handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    next(error);
  }
}

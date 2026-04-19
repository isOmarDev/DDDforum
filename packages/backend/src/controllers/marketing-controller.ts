import express, { Request, Response, NextFunction, Router } from 'express';

import { AddEmailToListDTO } from '../dtos/marketingDTO';
import { MarketingService } from '../services/marketing-service';

export class MarketingController {
  private readonly router: Router;

  constructor(private marketingService: MarketingService) {
    this.router = express.Router();
    this.setupRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post('/', this.addEmailToList.bind(this));
  }

  public async addEmailToList(req: Request, res: Response, next: NextFunction) {
    const body = AddEmailToListDTO.validateRequest(req.body);

    await this.marketingService.addEmailToList(body);

    try {
      return res.status(201).json({
        error: undefined,
        data: { subscription: { email: body.email } },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

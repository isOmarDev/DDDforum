import express, { Request, Response, NextFunction, Router } from 'express';

import { UserService } from './user-service';
import { CreateUserDTO } from './user-dto';
import { UserErrors } from './user-errors';

export class UserController {
  private readonly router: Router;

  constructor(
    private userService: UserService,
    private userErrors: typeof UserErrors,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorExceptionHandler();
  }

  public getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post('/', this.createUser.bind(this));
    this.router.get('/', this.getUsers.bind(this));
  }

  private setupErrorExceptionHandler() {
    this.router.use(this.userErrors.handle);
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateUserDTO.validateRequest(req.body);

      const user = await this.userService.createUser(dto);

      return res.status(201).json({
        error: undefined,
        data: { user },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;

      const users = await this.userService.getUsers(filters);

      return res.status(200).json({
        error: undefined,
        data: { users },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

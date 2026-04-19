import express, { Request, Response, NextFunction, Router } from 'express';
import { UserService } from '../services/user-service';
import { CreateUserDTO } from '../dtos/userDTO';
import { parseUserForResponse } from '../shared/utils';

export class UserController {
  private readonly router: Router;

  constructor(private userService: UserService) {
    this.router = express.Router();
    this.setupRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post('/', this.createUser.bind(this));
    this.router.get('/', this.getUsers.bind(this));
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateUserDTO.validateRequest(req.body);

      const user = await this.userService.createUser(dto);

      return res.status(201).json({
        error: undefined,
        data: { user: parseUserForResponse(user) },
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
        data: { users: users.map(parseUserForResponse) },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

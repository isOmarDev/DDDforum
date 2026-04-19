import express, { Request, Response, NextFunction, Router } from 'express';
import { PostService } from '../services/post-service';
import { parseUserForResponse } from '../shared/utils';

export class PostController {
  private readonly router: Router;

  constructor(private postService: PostService) {
    this.router = express.Router();
    this.setupRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.get('/', this.getPosts.bind(this));
  }

  public async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;

      const posts = await this.postService.getPosts(filters);

      return res.status(200).json({
        error: undefined,
        data: { posts },
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

import express, { Request, Response, NextFunction, Router } from 'express';
import { PostService } from '../services/post-service';
import ErrorExceptionHandler from '../shared/errors/error-exception-handler';

export class PostController {
  private readonly router: Router;

  constructor(
    private postService: PostService,
    private errorExceptionHandler: typeof ErrorExceptionHandler.handle,
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorExceptionHandler();
  }

  public getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.get('/', this.getPosts.bind(this));
  }

  private setupErrorExceptionHandler() {
    this.router.use(this.errorExceptionHandler);
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

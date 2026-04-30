import { PostRepo } from './post-repo';
import { PostService } from './post-service';
import { PostController } from './post-controller';
import { PostErrors } from './post-errors';
import WebServer from '../../shared/server';
import { Database } from '../../shared/database';

export class PostModule {
  private postRepo: PostRepo;
  private postService: PostService;
  private postController: PostController;

  private constructor(private db: Database) {
    this.postRepo = this.createPostRepo();
    this.postService = this.createPostService();
    this.postController = this.createPostController();
  }

  static build(db: Database) {
    return new PostModule(db);
  }

  private createPostRepo() {
    return new PostRepo(this.db.getClient());
  }

  private createPostService() {
    return new PostService(this.postRepo);
  }

  private createPostController() {
    return new PostController(this.postService, PostErrors);
  }

  public getPostController() {
    return this.postController;
  }

  public mountRouter(server: WebServer) {
    server.moutRouter('/posts', this.postController.getRouter());
  }
}

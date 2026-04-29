import WebServer from '../server';
import { Database } from '../database';
import { Config } from '../config';
import {
  UserController,
  UserRepo,
  UserService,
  UserErrors,
} from '../../modules/user';
import {
  PostController,
  PostRepo,
  PostService,
  PostErrors,
} from '../../modules/post';
import {
  MarketingController,
  MarketingService,
  MarketingErrors,
} from '../../modules/marketing';
import { FakeMailService } from '../../modules/notification';

export type Controllers = {
  userController: UserController;
  postController: PostController;
  marketingController: MarketingController;
};

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;
  private webServer: WebServer;
  private db: Database;
  private userService: UserService;
  private postService: PostService;
  private marketingService: MarketingService;
  private controllers: Controllers;

  private constructor(private config: Config) {
    this.db = this.createDb();
    this.userService = this.createUsersService();
    this.postService = this.createPostService();
    this.marketingService = this.createMarketingService();
    this.controllers = this.createControllers();
    this.webServer = this.createWebServer();
  }

  static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot(config);
    }

    return CompositionRoot.instance;
  }

  private createWebServer() {
    return new WebServer(
      { port: 3000, env: this.config.env },
      this.getControllers(),
    );
  }

  public getWebServer() {
    return this.webServer;
  }

  private createDb() {
    return new Database();
  }

  public getDb() {
    return this.db;
  }

  private createUsersService() {
    const userRepo = new UserRepo(this.db.getClient());
    return new UserService(userRepo);
  }

  private getUserService() {
    return this.userService;
  }

  private createPostService() {
    const postRepo = new PostRepo(this.db.getClient());
    return new PostService(postRepo);
  }

  private getPostService() {
    return this.postService;
  }

  private createMarketingService() {
    const fakeMailService = new FakeMailService();
    return new MarketingService(fakeMailService);
  }

  private getMarketingService() {
    return this.marketingService;
  }

  private createControllers() {
    const userService = this.getUserService();
    const postService = this.getPostService();
    const marketingService = this.getMarketingService();

    const userController = new UserController(userService, UserErrors);
    const postController = new PostController(postService, PostErrors);
    const marketingController = new MarketingController(
      marketingService,
      MarketingErrors,
    );

    return { userController, postController, marketingController };
  }

  private getControllers() {
    return this.controllers;
  }
}

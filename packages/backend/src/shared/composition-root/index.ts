import WebServer from '../server';
import { Database } from '../database';
import { Config } from '../config';
import { UserModule } from '../../modules/user';
import { PostModule } from '../../modules/post';
import { MarketingModule } from '../../modules/marketing';
import GlobalErrorHandler from '../errors/global-error-handler';

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;
  private webServer: WebServer;
  private db: Database;
  private userModule: UserModule;
  private postModule: PostModule;
  private marketingModule: MarketingModule;

  private constructor(private config: Config) {
    this.db = this.createDb();
    this.userModule = this.createUsersModule();
    this.postModule = this.createPostModule();
    this.marketingModule = this.createMarketingModule();
    this.webServer = this.createWebServer();
    this.mountRouters();
    this.registerGlobalErrorHandler();
  }

  static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot(config);
    }

    return CompositionRoot.instance;
  }

  private createWebServer() {
    return new WebServer({ port: 3000, env: this.config.env });
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

  private createUsersModule() {
    return UserModule.build(this.db);
  }

  private createPostModule() {
    return PostModule.build(this.db);
  }

  private createMarketingModule() {
    return MarketingModule.build();
  }

  private mountRouters() {
    this.marketingModule.mountRouter(this.webServer);
    this.userModule.mountRouter(this.webServer);
    this.postModule.mountRouter(this.webServer);
  }

  private registerGlobalErrorHandler() {
    this.webServer.setupGlobalErrorHandler(GlobalErrorHandler.handle);
  }
}

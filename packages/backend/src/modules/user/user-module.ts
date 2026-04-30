import { UserRepo } from './user-repo';
import { UserService } from './user-service';
import { UserController } from './user-controller';
import { UserErrors } from './user-errors';
import WebServer from '../../shared/server';
import { Database } from '../../shared/database';

export class UserModule {
  private userRepo: UserRepo;
  private userService: UserService;
  private userController: UserController;

  private constructor(private db: Database) {
    this.userRepo = this.createUserRepo();
    this.userService = this.createUserService();
    this.userController = this.createUserController();
  }

  static build(db: Database) {
    return new UserModule(db);
  }

  private createUserRepo() {
    return new UserRepo(this.db.getClient());
  }

  private createUserService() {
    return new UserService(this.userRepo);
  }

  private createUserController() {
    return new UserController(this.userService, UserErrors);
  }

  public getUserController() {
    return this.userController;
  }

  public mountRouter(server: WebServer) {
    server.moutRouter('/users', this.userController.getRouter());
  }
}

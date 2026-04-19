import { Server as HttpServer } from 'http';
import express, { Express } from 'express';

import cors from 'cors';

import { prisma } from './database';
import ErrorExceptionHandler from './shared/errors/error-exception-handler';
import { UserController } from './controllers/user-controller';
import { PostController } from './controllers/post-controller';
import { MarketingController } from './controllers/marketing-controller';

class Server {
  private readonly _app: Express;

  constructor(
    private userController: UserController,
    private postController: PostController,
    private marketingController: MarketingController,
  ) {
    this._app = express();
    this.addMiddlewares();
    this.registerRouters();
    this.addErrorExceptionHandler();
  }

  get app() {
    return this._app;
  }

  private addMiddlewares() {
    this._app.use(express.json());
    this._app.use(cors());
  }

  private registerRouters() {
    this._app.use('/users', this.userController.getRouter());
    this._app.use('/posts', this.postController.getRouter());
    this._app.use('/marketing', this.marketingController.getRouter());
  }

  private addErrorExceptionHandler() {
    this._app.use(ErrorExceptionHandler.handle);
  }

  private enableGracefulShutdown(server: HttpServer) {
    const gracefulShutdown = async () => {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });

      setTimeout(() => {
        console.error(
          'Could not close connections in time, forcefully shutting down',
        );
        process.exit(1);
      }, 10000);
    };

    // Graceful shutdown
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGKILL', gracefulShutdown);
  }

  public start(port: number) {
    const server = this._app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    this.enableGracefulShutdown(server);
  }
}

export default Server;

import { Server } from 'http';
import express, { Express, Router } from 'express';
import cors from 'cors';

import type { ErrorHandler } from '../errors/global-error-handler';

type WebServerConfig = {
  port: number;
  env: string;
};

class WebServer {
  private readonly _app: Express;
  private state: 'started' | 'stopped';
  private instance: Server | undefined;

  constructor(private config: WebServerConfig) {
    this.state = 'stopped';
    this._app = express();
    this.addMiddlewares();
  }

  public getApp() {
    return this._app;
  }

  private addMiddlewares() {
    this._app.use(express.json());
    this._app.use(cors());
  }
  public moutRouter(path: string, router: Router) {
    this._app.use(path, router);
  }

  public setupGlobalErrorHandler(errorHandler: ErrorHandler) {
    this._app.use(errorHandler);
  }

  public async start(): Promise<void> {
    const { port } = this.config;

    return new Promise((resolve, _reject) => {
      this.instance = this._app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
      this.state = 'started';
      resolve();
    });
  }

  public async stop() {
    return new Promise((resolve, reject) => {
      if (!this.instance) return reject('Server not started');
      this.instance.close((error) => {
        if (error) return reject('Error stopping the server');
        this.state = 'stopped';
        resolve('Server stopped');
      });
    });
  }

  public isStarted() {
    return this.state === 'started';
  }
}

export default WebServer;

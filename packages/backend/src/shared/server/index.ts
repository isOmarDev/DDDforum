import { Server } from 'http';
import express, { Express } from 'express';
import cors from 'cors';

import type { Controllers } from '../composition-root';

type WebServerConfig = {
  port: number;
  env: string;
};

class WebServer {
  private readonly _app: Express;
  private state: 'started' | 'stopped';
  private instance: Server | undefined;

  constructor(
    private config: WebServerConfig,
    private controllers: Controllers,
  ) {
    this.state = 'stopped';
    this._app = express();
    this.addMiddlewares();
    this.registerRouters();
  }

  public getApp() {
    return this._app;
  }

  private addMiddlewares() {
    this._app.use(express.json());
    this._app.use(cors());
  }

  private registerRouters() {
    const { userController, postController, marketingController } =
      this.controllers;

    this._app.use('/users', userController.getRouter());
    this._app.use('/posts', postController.getRouter());
    this._app.use('/marketing', marketingController.getRouter());
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

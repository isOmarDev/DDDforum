import { CompositionRoot } from '../composition-root';
import { Config } from '../config';

const config = new Config('start');
const compositionRoot = CompositionRoot.createCompositionRoot(config);

const webServer = compositionRoot.getWebServer();
const db = compositionRoot.getDb();

export const bootstrap = async () => {
  await db.connect();
  await webServer.start();
};

export const app = webServer.getApp();
export const database = db.getClient();

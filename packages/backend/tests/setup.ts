import { Config } from '../src/shared/config';
import { CompositionRoot } from '../src/shared/composition-root';
import { resetDatabase } from './support/fixtures';

const config: Config = new Config('test:e2e');
const compositionRoot = CompositionRoot.createCompositionRoot(config);

const server = compositionRoot.getWebServer();
const db = compositionRoot.getDb();

beforeAll(async () => {
  await resetDatabase();
  await db.connect();
  await server.start();
});

afterAll(async () => {
  await db.disconnect();
  await server.stop();
});

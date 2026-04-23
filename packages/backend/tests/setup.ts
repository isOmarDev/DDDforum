import { database } from '../src/shared/bootstrap';
import { resetDatabase } from './fixtures';

beforeAll(async () => {
  // Reset database
  await resetDatabase();
});

afterAll(async () => {
  // Disconnect Prisma so Jest can exit cleanly
  await database.$disconnect();
});

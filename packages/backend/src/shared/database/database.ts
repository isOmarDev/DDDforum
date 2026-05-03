import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/client';

export class Database {
  private client: PrismaClient;

  constructor() {
    this.client = this.createClient();
  }

  public getClient() {
    return this.client;
  }

  private createClient() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  }

  public async connect() {
    await this.client.$connect();
  }

  public async disconnect() {
    await this.client.$disconnect();
  }
}

import { PrismaClient } from '../../shared/database';
import { CreateUserInput } from '@dddforum/shared/api/users';

export class UserRepo {
  constructor(private prisma: PrismaClient) {}

  public async create(user: CreateUserInput) {
    const { email, username, firstName, lastName, password } = user;

    return await this.prisma.$transaction(async () => {
      const user = await this.prisma.user.create({
        data: { email, username, firstName, lastName, password },
      });
      await this.prisma.member.create({ data: { userId: user.id } });
      return user;
    });
  }

  public async findByEmail(email: string) {
    const data = await this.prisma.user.findFirst({ where: { email } });
    return data;
  }

  public async findByUsername(username: string) {
    const data = await this.prisma.user.findFirst({ where: { username } });
    return data;
  }

  public async findAll(filters?: { email?: string }) {
    const data = await this.prisma.user.findMany({ where: filters });
    return data;
  }
}

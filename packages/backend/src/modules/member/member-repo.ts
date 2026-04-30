import { PrismaClient } from '../../shared/generated/client';

export class MemberRepo {
  constructor(private prisma: PrismaClient) {}

  public async create(userId: number) {
    const data = await this.prisma.member.create({ data: { userId } });
    return data;
  }
}

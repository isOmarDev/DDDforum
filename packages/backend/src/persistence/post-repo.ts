import { PrismaClient } from '../shared/generated/client';

export class PostRepo {
  constructor(private prisma: PrismaClient) {}

  public async findAll(filters?: {}) {
    const data = await this.prisma.post.findMany({
      where: filters,
      include: {
        votes: true,
        comments: true,
        memberPostedBy: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { dateCreated: 'desc' },
    });
    return data;
  }
}

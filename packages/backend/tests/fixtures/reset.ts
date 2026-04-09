import { prisma } from '../../src/database';

export async function resetDatabase() {
  const deleteAllUsers = prisma.user.deleteMany();
  const deleteAllMember = prisma.member.deleteMany();
  const deleteAllPosts = prisma.post.deleteMany();
  const deleteAllVotes = prisma.vote.deleteMany();

  try {
    await prisma.$transaction([
      deleteAllUsers,
      deleteAllMember,
      deleteAllPosts,
      deleteAllVotes,
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

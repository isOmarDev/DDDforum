import { prisma } from '../../src/database';

export async function resetDatabase() {
  const deleteAllUsers = prisma.user.deleteMany();
  const deleteAllMembers = prisma.member.deleteMany();
  const deleteAllPosts = prisma.post.deleteMany();
  const deleteAllComments = prisma.comment.deleteMany();
  const deleteAllVotes = prisma.vote.deleteMany();

  try {
    await prisma.$transaction([
      deleteAllUsers,
      deleteAllMembers,
      deleteAllPosts,
      deleteAllComments,
      deleteAllVotes,
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

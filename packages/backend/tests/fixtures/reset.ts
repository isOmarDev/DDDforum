import { database } from '../../src/shared/bootstrap';

export async function resetDatabase() {
  const deleteAllUsers = database.user.deleteMany();
  const deleteAllMembers = database.member.deleteMany();
  const deleteAllPosts = database.post.deleteMany();
  const deleteAllComments = database.comment.deleteMany();
  const deleteAllVotes = database.vote.deleteMany();

  try {
    await database.$transaction([
      deleteAllUsers,
      deleteAllMembers,
      deleteAllPosts,
      deleteAllComments,
      deleteAllVotes,
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await database.$disconnect();
  }
}

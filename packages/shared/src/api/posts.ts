import axios from 'axios';

import { ApiResponse, ServerError } from '.';
import { User } from './users';

type GetPostsSortOption = 'recent';

export type GetPostsQuery = {
  sort: GetPostsSortOption;
};

export type Vote = {
  id: number;
  postId: number;
  voteType: 'Upvote' | 'Downvote';
};

export type Comment = object;

export type Post = {
  id: number;
  title: string;
  content: string;
  dateCreated: string;
  memberId: number;
  memberPostedBy: {
    user: User;
  };
  votes: Vote[];
  comments: Comment[];
  postType: string;
};

export type GetPostErrors = ServerError;

export type GetPostsResponse = ApiResponse<{ posts: Post[] }, GetPostErrors>;

export type PostsResponse = GetPostsResponse;

export const createPostsApi = (apiURL: string) => {
  return {
    getPosts: async (query?: GetPostsQuery): Promise<PostsResponse> => {
      try {
        const successResponse = await axios.get(`${apiURL}/posts`, {
          params: query,
        });
        return successResponse.data as GetPostsResponse;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetPostsResponse;
        }
        throw new Error('Network or server unreachable');
      }
    },
  };
};

import { createUsersApi } from './users';
import { createMarketingApi } from './marketing';
import { createPostsApi } from './posts';

export type Error<U> = {
  message: string;
  code: U;
};

export type ApiResponse<T, U extends string> = {
  success: boolean;
  data: T | null;
  error: Error<U> | undefined;
};

export type ValidationError = 'ValidationError';
export type ServerError = 'ServerError';
export type ClientError = 'ClientError';

export type GenericErrors = ValidationError | ServerError | ClientError;

export const createApiClient = (apiUrl: string) => {
  return {
    users: createUsersApi(apiUrl),
    posts: createPostsApi(apiUrl),
    marketing: createMarketingApi(apiUrl),
  };
};

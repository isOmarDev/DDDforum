import axios from 'axios';

import { ApiResponse, GenericErrors, ServerError } from '.';

export type CreateUserInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type GetUsersQuery = {
  email: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

type UsernameAlreadyTakenError = 'UsernameAlreadyTaken';
type EmailAlreadyInUseError = 'EmailAlreadyInUse';

export type CreateUserErrors =
  | UsernameAlreadyTakenError
  | EmailAlreadyInUseError
  | GenericErrors;
export type CreateUserResponse = ApiResponse<{ user: User }, CreateUserErrors>;

export type GetUsersErrors = ServerError;
export type GetUsersResponse = ApiResponse<{ user: User }, GetUsersErrors>;

export type UserResponse = CreateUserResponse;

export const createUsersApi = (apiUrl: string) => {
  return {
    register: async (input: CreateUserInput) => {
      try {
        const response = await axios.post(`${apiUrl}/users`, {
          ...input,
        });
        return response.data as CreateUserResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as CreateUserResponse;
        }
        throw new Error('Network or server unreachable');
      }
    },
    getUsers: async (query: GetUsersQuery) => {
      try {
        const response = await axios.get(`${apiUrl}/users`, { params: query });
        return response.data as GetUsersResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as GetUsersResponse;
        }
        throw new Error('Network or server unreachable');
      }
    },
  };
};

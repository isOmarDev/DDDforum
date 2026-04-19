import { ApiResponse, GenericErrors } from '.';

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

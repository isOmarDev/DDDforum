import { InvalidRequestBodyException } from '../shared/errors/exceptions';
import { CreateUserInput } from '../shared/types/user';
import { isMissingKeys } from '../shared/utils';

export class CreateUserDTO {
  private constructor(
    public email: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public password: string,
  ) {}

  static validateRequest(body: unknown) {
    const requiredKeys = [
      'email',
      'username',
      'firstName',
      'lastName',
      'password',
    ];

    if (
      !body ||
      typeof body !== 'object' ||
      isMissingKeys(body, requiredKeys)
    ) {
      throw new InvalidRequestBodyException(requiredKeys);
    }
    const { email, username, firstName, lastName, password } =
      body as CreateUserInput;

    return new CreateUserDTO(email, username, firstName, lastName, password);
  }
}

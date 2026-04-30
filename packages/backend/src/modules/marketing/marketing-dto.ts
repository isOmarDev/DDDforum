import { InvalidRequestBodyException } from '../../shared/errors/exceptions';
import { isMissingKeys } from '../../shared/utils/utils';

export class AddEmailToListDTO {
  private constructor(public email: string) {}

  static validateRequest(body: unknown) {
    const requiredKeys = ['email'];

    if (
      !body ||
      typeof body !== 'object' ||
      isMissingKeys(body, requiredKeys)
    ) {
      throw new InvalidRequestBodyException(requiredKeys);
    }
    const { email } = body as { email: string };

    return new AddEmailToListDTO(email);
  }
}

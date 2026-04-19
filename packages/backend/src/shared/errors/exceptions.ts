export class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super(`Body is missing required key: ${missingKeys.join(', ')}`);
  }
}

export class InvalidRequestParamsException extends Error {
  constructor(missingKeys: string[]) {
    super(
      `Missing required param${
        missingKeys.length > 1 ? 's' : ''
      }: ${missingKeys.join(', ')}`,
    );
  }
}

export class InvalidRequestQueryException extends Error {
  constructor(missingKeys: string[]) {
    super(
      `Missing required query param${
        missingKeys.length > 1 ? 's' : ''
      }: ${missingKeys.join(', ')}`,
    );
  }
}

export class EmailAlreadyInUseException extends Error {
  constructor() {
    super(`Email is already in use.`);
  }
}

export class UsernameAlreadyTakenException extends Error {
  constructor() {
    super(`Username is already taken.`);
  }
}

export class EmailNotAddedToMailListException extends Error {
  constructor(email: string) {
    super(`Failed to add email "${email}" to mailing list.`);
  }
}

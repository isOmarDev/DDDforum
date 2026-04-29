export class EmailNotAddedToMailListException extends Error {
  constructor(email: string) {
    super(`Failed to add email "${email}" to mailing list.`);
  }
}

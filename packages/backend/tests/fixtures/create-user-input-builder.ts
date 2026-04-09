import { faker } from '@faker-js/faker';

export type CreateUserInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};

export class CreateUserInputBuilder {
  private props: CreateUserInput;

  constructor() {
    this.props = {
      email: faker.internet.email(),
      username: faker.internet.username(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }

  withEmail(email: string) {
    this.props.email = email;
    return this;
  }

  withUsername(username: string) {
    this.props.username = username;
    return this;
  }

  withFirstName(firstName: string) {
    this.props.firstName = firstName;
    return this;
  }

  withLastName(lastName: string) {
    this.props.lastName = lastName;
    return this;
  }

  public build() {
    return this.props;
  }
}

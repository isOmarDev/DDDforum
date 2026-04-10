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

  withEmail(email: string = faker.internet.email()) {
    this.props.email = email;
    return this;
  }

  withUsername(username: string = faker.internet.username()) {
    this.props.username = username;
    return this;
  }

  withFirstName(firstName: string = faker.person.firstName()) {
    this.props.firstName = firstName;
    return this;
  }

  withLastName(lastName: string = faker.person.lastName()) {
    this.props.lastName = lastName;
    return this;
  }

  public build() {
    return this.props;
  }
}

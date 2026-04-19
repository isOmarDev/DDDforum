import { faker } from '@faker-js/faker';

export type CreateUserInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class CreateUserInputBuilder {
  private props: CreateUserInput;

  constructor() {
    this.props = {
      email: faker.internet.email(),
      username: faker.internet.username(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
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

  withPassword(
    password?: string,
    options?: Parameters<typeof faker.internet.password>[0],
  ) {
    this.props.password = password ?? faker.internet.password(options);
    return this;
  }

  public build() {
    return this.props;
  }
}

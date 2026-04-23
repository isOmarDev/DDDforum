import { faker } from '@faker-js/faker';

import { database } from '../../../src/shared/bootstrap';
import { CreateUserInput } from '../../../../shared/tests/builders/create-user-input-builder';

export class UserBuilder {
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

  public async build() {
    const user = await database.user.create({ data: this.props });
    const { password, ...restUser } = user;
    return restUser;
  }
}

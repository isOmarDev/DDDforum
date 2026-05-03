import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { resetDatabase } from '../support/fixtures';
import { UserBuilder } from '../support/builders';
import { ErrorException } from '../../src/shared/errors/error-exception-types';
import { userErrorCodes } from '../../src/modules/user/user-errors';
import { CreateUserInputBuilder } from '../../../shared/tests/builders/create-user-input-builder';
import { createApiClient } from '@dddforum/shared/api';
import type { AddEmailToListResponse } from '@dddforum/shared/api/marketing';
import type {
  CreateUserInput,
  CreateUserResponse,
} from '@dddforum/shared/api/users';

const feature = loadFeature(
  path.join(__dirname, '../../../shared/tests/features/registration.feature'),
);

defineFeature(feature, (test) => {
  const apiClient = createApiClient('http://localhost:3000');

  let response: CreateUserResponse;
  let usersResponses: CreateUserResponse[];
  let addEmailToListResponse: AddEmailToListResponse;

  afterEach(async () => {
    await resetDatabase();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserInput;

    given('I am a new user', () => {
      user = new CreateUserInputBuilder().withUsername().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        response = await apiClient.users.register(user);

        addEmailToListResponse = await apiClient.marketing.AddEmailToList(
          user.email,
        );
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = response;

      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data!.user.id).toBeDefined();
      expect(data!.user.email).toBe(user.email);
      expect(data!.user.firstName).toBe(user.firstName);
      expect(data!.user.lastName).toBe(user.lastName);
      expect(data!.user.username).toBe(user.username);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResponse.data?.subscription.email).toBe(user.email);
      expect(addEmailToListResponse.success).toBeTruthy();
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserInput;

    given('I am a new user', () => {
      user = new CreateUserInputBuilder().build();
    });

    when(
      'I register with valid account details declining marketing emails',
      async () => {
        response = await apiClient.users.register(user);
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = response;

      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data!.user.id).toBeDefined();
      expect(data!.user.email).toBe(user.email);
      expect(data!.user.firstName).toBe(user.firstName);
      expect(data!.user.lastName).toBe(user.lastName);
      expect(data!.user.username).toBe(user.username);
    });

    and('I should not expect to receive marketing emails', () => {});
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    let user: Partial<CreateUserInput>;

    given('I am a new user', () => {
      const newUser = new CreateUserInputBuilder().build();
      user = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };
    });

    when('I register with invalid account details', async () => {
      response = await apiClient.users.register(user as CreateUserInput);
    });

    then('I should see an error notifying me that my input is invalid', () => {
      const { data, success, error } = response;

      expect(success).toBeFalsy();
      expect(error?.code).toBe(ErrorException.ValidationError);
      expect(data).toBeNull();
    });

    and('I should not have been sent access to account details', () => {
      const { data, success, error } = response;

      expect(success).toBeFalsy();
      expect(error?.code).toBe(ErrorException.ValidationError);
      expect(data).toBeNull();
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    let users: CreateUserInput[];

    given(
      'a set of users already created accounts',
      async (table: Omit<CreateUserInput, 'password'>[]) => {
        await Promise.all(
          table.map((row) => {
            return new UserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .build();
          }),
        );
      },
    );

    when(
      'new users attempt to register with those emails',
      async (table: Omit<CreateUserInput, 'password'>[]) => {
        users = table.map((row) =>
          new CreateUserInputBuilder()
            .withEmail(row.email)
            .withUsername(row.username)
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .build(),
        );

        usersResponses = await Promise.all(
          users.map((user) => {
            return apiClient.users.register(user);
          }),
        );
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        usersResponses.forEach((response) => {
          const { data, success, error } = response;

          expect(success).toBeFalsy();
          expect(error?.code).toBe(userErrorCodes.EmailAlreadyInUse);
          expect(data).toBeNull();
        });
      },
    );

    and('they should not have been sent access to account details', () => {});
  });

  test('Username already taken', ({ given, when, then, and }) => {
    let users: CreateUserInput[];

    given(
      'a set of users have already created their accounts with valid details',
      async (table: Omit<CreateUserInput, 'password'>[]) => {
        await Promise.all(
          table.map((row) => {
            return new UserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .build();
          }),
        );
      },
    );

    when(
      'new users attempt to register with already taken usernames',
      async (table: Omit<CreateUserInput, 'password'>[]) => {
        users = table.map((row) =>
          new CreateUserInputBuilder()
            .withEmail(row.email)
            .withUsername(row.username)
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .build(),
        );

        usersResponses = await Promise.all(
          users.map((user) => {
            return apiClient.users.register(user);
          }),
        );
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        usersResponses.forEach((response) => {
          const { data, success, error } = response;

          expect(success).toBeFalsy();
          expect(error?.code).toBe(userErrorCodes.UsernameAlreadyTaken);
          expect(data).toBeNull();
        });
      },
    );

    and('they should not have been sent access to account details', () => {});
  });
});

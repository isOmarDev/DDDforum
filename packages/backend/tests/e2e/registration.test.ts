import path from 'path';
import { Express } from 'express';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';

import type { Response } from '../types';
import { type CreateUserInput, resetDatabase, UserBuilder } from '../fixtures';
import { ErrorException } from '../../src/shared/errors/error-exception-types';
import { CompositionRoot } from '../../src/shared/composition-root';
import { Config } from '../../src/shared/config';
import { Database } from '../../src/shared/database';
import { userErrorCodes } from '../../src/modules/user/user-errors';
import { CreateUserInputBuilder } from '../../../shared/tests/builders/create-user-input-builder';
import type { CreateUserResponse } from '@dddforum/shared/types/users';
import type { AddEmailToListResponse } from '@dddforum/shared/types/marketing';

const feature = loadFeature(
  path.join(__dirname, '../../../shared/tests/features/registration.feature'),
);

defineFeature(feature, (test) => {
  let compositionRoot: CompositionRoot;
  let app: Express;
  let db: Database;

  const config: Config = new Config('test:e2e');

  type UserResponse = Response<CreateUserResponse>;

  let response: UserResponse;
  let usersResponses: UserResponse[];
  let addEmailToListResponse: Response<AddEmailToListResponse>;

  beforeAll(async () => {
    compositionRoot = CompositionRoot.createCompositionRoot(config);
    const server = compositionRoot.getWebServer();
    app = server.getApp();
    db = compositionRoot.getDb();
    await db.connect();
  });

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
      user = new CreateUserInputBuilder().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        response = await request(app).post('/users').send(user);

        addEmailToListResponse = await request(app)
          .post('/marketing')
          .send({ email: user.email });
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = response.body;

      expect(response.status).toBe(201);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data!.user.id).toBeDefined();
      expect(data!.user.email).toBe(user.email);
      expect(data!.user.firstName).toBe(user.firstName);
      expect(data!.user.lastName).toBe(user.lastName);
      expect(data!.user.username).toBe(user.username);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResponse.status).toBe(201);
      expect(addEmailToListResponse.body.data?.subscription.email).toBe(
        user.email,
      );
      expect(addEmailToListResponse.body.success).toBeTruthy();
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
        response = await request(app).post('/users').send(user);
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = response.body;

      expect(response.status).toBe(201);
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
      response = await request(app).post('/users').send(user);
    });

    then('I should see an error notifying me that my input is invalid', () => {
      const { data, success, error } = response.body;

      expect(response.status).toBe(400);
      expect(success).toBeFalsy();
      expect(error?.code).toBe(ErrorException.ValidationError);
      expect(data).toBeUndefined();
    });

    and('I should not have been sent access to account details', () => {
      const { data, success, error } = response.body;

      expect(response.status).toBe(400);
      expect(success).toBeFalsy();
      expect(error?.code).toBe(ErrorException.ValidationError);
      expect(data).toBeUndefined();
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
            return request(app).post('/users').send(user);
          }),
        );
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        usersResponses.forEach((response) => {
          const { data, success, error } = response.body;

          expect(response.status).toBe(409);
          expect(success).toBeFalsy();
          expect(error?.code).toBe(userErrorCodes.EmailAlreadyInUse);
          expect(data).toBeUndefined();
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
            return request(app).post('/users').send(user);
          }),
        );
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        usersResponses.forEach((response) => {
          const { data, success, error } = response.body;

          expect(response.status).toBe(409);
          expect(success).toBeFalsy();
          expect(error?.code).toBe(userErrorCodes.UsernameAlreadyTaken);
          expect(data).toBeUndefined();
        });
      },
    );

    and('they should not have been sent access to account details', () => {});
  });
});

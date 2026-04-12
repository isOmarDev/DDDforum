import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request, { type Response } from 'supertest';

import { app, Errors } from '../../src';
import {
  CreateUserInputBuilder,
  type CreateUserInput,
  resetDatabase,
  UserBuilder,
} from '../fixtures';

const feature = loadFeature(
  path.join(__dirname, '../../../shared/tests/features/registration.feature'),
);

defineFeature(feature, (test) => {
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
    let response: Omit<Response, 'body'> & {
      body: {
        error?: string;
        data?: { id: string } & typeof user;
        success: boolean;
      };
    };
    let addEmailToListResponse: Response;

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
      expect(data!.id).toBeDefined();
      expect(data!.email).toBe(user.email);
      expect(data!.firstName).toBe(user.firstName);
      expect(data!.lastName).toBe(user.lastName);
      expect(data!.username).toBe(user.username);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResponse.status).toBe(201);
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
    let createUserResponse: Omit<Response, 'body'> & {
      body: {
        error?: string;
        data?: { id: string } & typeof user;
        success: boolean;
      };
    };

    given('I am a new user', () => {
      user = new CreateUserInputBuilder().build();
    });

    when(
      'I register with valid account details declining marketing emails',
      async () => {
        createUserResponse = await request(app).post('/users').send(user);
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = createUserResponse.body;

      expect(createUserResponse.status).toBe(201);
      expect(success).toBeTruthy();
      expect(error).toBeUndefined();
      expect(data!.id).toBeDefined();
      expect(data!.email).toBe(user.email);
      expect(data!.firstName).toBe(user.firstName);
      expect(data!.lastName).toBe(user.lastName);
      expect(data!.username).toBe(user.username);
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
    let response: Omit<Response, 'body'> & {
      body: {
        error?: string;
        data?: { id: string } & typeof user;
        success: boolean;
      };
    };

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
      expect(error).toBe(Errors.ValidationError);
      expect(data).toBeUndefined();
    });

    and('I should not have been sent access to account details', () => {
      const { data, success, error } = response.body;

      expect(response.status).toBe(400);
      expect(success).toBeFalsy();
      expect(error).toBe(Errors.ValidationError);
      expect(data).toBeUndefined();
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    let users: CreateUserInput[];
    let responses: Array<
      Omit<Response, 'body'> & {
        body: {
          error?: string;
          data?: { id: string } & CreateUserInput;
          success: boolean;
        };
      }
    >;

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

        responses = await Promise.all(
          users.map((user) => {
            return request(app).post('/users').send(user);
          }),
        );
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        responses.forEach((response) => {
          const { data, success, error } = response.body;

          expect(response.status).toBe(409);
          expect(success).toBeFalsy();
          expect(error).toBe(Errors.EmailAlreadyInUse);
          expect(data).toBeUndefined();
        });
      },
    );

    and('they should not have been sent access to account details', () => {});
  });

  test('Username already taken', ({ given, when, then, and }) => {
    let users: CreateUserInput[];
    let responses: Array<
      Omit<Response, 'body'> & {
        body: {
          error?: string;
          data?: { id: string } & CreateUserInput;
          success: boolean;
        };
      }
    >;

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

        responses = await Promise.all(
          users.map((user) => {
            return request(app).post('/users').send(user);
          }),
        );
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        responses.forEach((response) => {
          const { data, success, error } = response.body;

          expect(response.status).toBe(409);
          expect(success).toBeFalsy();
          expect(error).toBe(Errors.UsernameAlreadyTaken);
          expect(data).toBeUndefined();
        });
      },
    );

    and('they should not have been sent access to account details', () => {});
  });
});

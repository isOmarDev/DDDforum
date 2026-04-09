import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request, { type Response } from 'supertest';

import { app } from '../../src';
import {
  CreateUserInputBuilder,
  type CreateUserInput,
  resetDatabase,
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
    let createUserInput: CreateUserInput;
    let createUserResponse: Response;
    let addEmailToListResponse: Response;

    given('I am a new user', () => {
      createUserInput = new CreateUserInputBuilder().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResponse = await request(app)
          .post('/user/new')
          .send(createUserInput);

        addEmailToListResponse = await request(app)
          .post('/marketing/new')
          .send(createUserInput.email);
      },
    );

    then('I should be granted access to my account', () => {
      expect(createUserResponse.success).toBeTruthy();
      expect(createUserResponse.error).toBeUndefined();
      expect(createUserResponse.status).toBe(201);
      expect(createUserResponse.body.id).toBeDefined();
      expect(createUserResponse.body.email).toBe(createUserInput.email);
      expect(createUserResponse.body.firstName.toBe(createUserInput.firstName));
      expect(createUserResponse.body.lastName.toBe(createUserInput.lastName));
      expect(createUserResponse.body.username.toBe(createUserInput.username));
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResponse.status).toBe(201);
      expect(addEmailToListResponse.success).toBeTruthy();
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {});

    when(
      'I register with valid account details declining marketing emails',
      () => {},
    );

    then('I should be granted access to my account', () => {});

    and('I should not expect to receive marketing emails', () => {});
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {});

    when('I register with invalid account details', () => {});

    then(
      'I should see an error notifying me that my input is invalid',
      () => {},
    );

    and('I should not have been sent access to account details', () => {});
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    given('a set of users already created accounts', (table) => {});

    when('new users attempt to register with those emails', () => {});

    then(
      'they should see an error notifying them that the account already exists',
      () => {},
    );

    and('they should not have been sent access to account details', () => {});
  });

  test('Username already taken', ({ given, when, then, and }) => {
    given(
      'a set of users have already created their accounts with valid details',
      (table) => {},
    );

    when(
      'new users attempt to register with already taken usernames',
      (table) => {},
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {},
    );

    and('they should not have been sent access to account details', () => {});
  });
});

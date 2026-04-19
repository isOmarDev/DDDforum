import type { Response as SupertestResponse } from 'supertest';

export type Response<T> = Omit<SupertestResponse, 'body'> & {
  body: T;
};

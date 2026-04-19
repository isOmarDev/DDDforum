export type Error<U> = {
  message: string;
  code: U;
};

export type ApiResponse<T, U extends string> = {
  success: boolean;
  data: T | undefined;
  error: Error<U> | undefined;
};

export type ValidationError = 'ValidationError';
export type ServerError = 'ServerError';
export type ClientError = 'ClientError';

export type GenericErrors = ValidationError | ServerError | ClientError;

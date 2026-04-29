import { ApiResponse, GenericErrors } from '.';

export type EmailSubscriber = { email: string };

type EmailNotAddedToMailListError = 'EmailNotAddedToMailList';

export type AddEmailToListErrors = EmailNotAddedToMailListError | GenericErrors;
export type AddEmailToListResponse = ApiResponse<
  { subscription: EmailSubscriber },
  AddEmailToListErrors
>;

export type MarketingResponse = AddEmailToListResponse;

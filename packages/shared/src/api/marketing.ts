import axios from 'axios';

import { ApiResponse, GenericErrors } from '.';

export type EmailSubscriber = { email: string };

type EmailNotAddedToMailListError = 'EmailNotAddedToMailList';
export type AddEmailToListErrors = EmailNotAddedToMailListError | GenericErrors;
export type AddEmailToListResponse = ApiResponse<
  { subscription: EmailSubscriber },
  AddEmailToListErrors
>;

export type MarketingResponse = AddEmailToListResponse;

export const createMarketingApi = (apiUrl: string) => {
  return {
    AddEmailToList: async (email: string) => {
      try {
        const response = await axios.post(`${apiUrl}/marketing`, {
          email,
        });
        return response.data as AddEmailToListResponse;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data as AddEmailToListResponse;
        }
        throw new Error('Network or server unreachable');
      }
    },
  };
};

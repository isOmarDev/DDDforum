import { User } from './generated/client';

export const isMissingKeys = (data: any, keysToCheckFor: string[]) => {
  for (let key of keysToCheckFor) {
    if (data[key] === undefined) return true;
  }
  return false;
};

export const parseUserForResponse = (user: User) => {
  const returnData = JSON.parse(JSON.stringify(user));
  delete returnData.password;
  return returnData;
};

export const isMissingKeys = (data: any, keysToCheckFor: string[]) => {
  for (let key of keysToCheckFor) {
    if (data[key] === undefined) return true;
  }
  return false;
};

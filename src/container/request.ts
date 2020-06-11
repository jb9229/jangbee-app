import * as Sentry from 'sentry-expo';

import { User } from 'src/types';

export const noticeUserError = (location: string, error: any, user?: User): void =>
{
  Sentry.captureMessage(`Location: ${location}\n\n Error Message: ${error?.message}\nn User: ${user?.uid}`);
  error && Sentry.captureException(error);
};

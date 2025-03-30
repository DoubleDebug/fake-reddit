import { User } from 'firebase/auth';

export function getUserProvider(user: User): 'google' | 'github' | 'password' {
  const providerId = user.providerData[0].providerId;
  switch (providerId) {
    case 'google.com':
      return 'google';
    case 'github.com':
      return 'github';
    case 'password':
      return 'password';
    default:
      return 'password';
  }
}

import { createContext } from 'react';

export const UserDataContext = createContext<IUserDataWithId | undefined>(
  undefined,
);

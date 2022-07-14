import { createContext } from 'react';

export const HeaderContext = createContext<{
  isSearchBarFocused: boolean;
  setIsSearchBarFocused: (f: boolean) => void;
}>({
  isSearchBarFocused: false,
  setIsSearchBarFocused: () => {},
});

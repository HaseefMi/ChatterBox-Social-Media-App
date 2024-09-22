import { createContext, useState } from 'react';

export const HomeAuth = createContext({
  isAuth: false,
  setIsAuth: () => {},
});

export const HomeAuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false)
  const value = {
    isAuth,
    setIsAuth
  };

  return <HomeAuth.Provider value={value}>{children}</HomeAuth.Provider>;
};

import { createContext, useState } from 'react';

export const UserContext = createContext({
  userName: '',
  setUserName: () => {},
});

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const value = {
    userName,
    setUserName
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

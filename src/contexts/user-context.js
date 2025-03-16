import { createContext, useState } from 'react';

export const UserContext = createContext({
  userName: '',
  setUserName: () => {},
  userInfo: {},
  setUserInfo: () => {},
});

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState({})
  const value = {
    userName,
    setUserName,
    userInfo,
    setUserInfo,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

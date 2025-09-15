// src/libraries/StoreContext/UserContext.js
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [{ isLogin, users }, setLogin] = useState({ isLogin: false }, { users: {} });
  const [modules, setModule] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const store = {
    users,
    isLogin,
    setLogin: ({ isLogin, users }) => setLogin({ isLogin, users }),
    modules,
    setModule: (modules) => setModule(modules),
    showMenu,
    setShowMenu: (showMenu) => setShowMenu(showMenu),
  };
  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
};

const UserConsumer = ({ children }) => <UserContext.Consumer>{children}</UserContext.Consumer>;

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

UserConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export { UserProvider, UserConsumer, UserContext };
export const useUserContext = () => useContext(UserContext);

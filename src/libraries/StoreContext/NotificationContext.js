// src/libraries/StoreContext/NotificationContext.js
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [{ isNotification }, setNotification] = useState({ isNotification: false });
  const store = {
    isNotification,
    setNotification: ({ isNotification }) => setNotification({ isNotification }),
  };
  return <NotificationContext.Provider value={store}>{children}</NotificationContext.Provider>;
};

const NotificationConsumer = ({ children }) => <NotificationContext.Consumer>{children}</NotificationContext.Consumer>;

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

NotificationConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export { NotificationProvider, NotificationConsumer, NotificationContext };
export const useNotificationContext = () => useContext(NotificationContext);

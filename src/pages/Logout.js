// src/pages/Logout.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { logoutEmployee } from '../services/employeeService';
import { Spinner } from '../components';
import { useUserContext } from '../libraries/StoreContext';
import { useApolloClient } from 'react-apollo';

function Logout() {
  const userStore = useUserContext();
  const client = useApolloClient();
  let isLogout = false;

  useEffect(() => {
    onLogout();
  }, []);

  async function onLogout() {
    if (!isLogout) {
      isLogout = true;
      await logoutEmployee(client);
      await AsyncStorage.removeItem('accessToken');
      userStore.setLogin({ isLogin: false, users: {} });
    }
  }

  return (
    <React.Fragment>
      <Spinner />
    </React.Fragment>
  );
}

Logout.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
};

export default Logout;

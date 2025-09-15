// src/libraries/Navigator.js
import { firebase } from '@react-native-firebase/app';
import GLOBALS from '../Globals';
import Orientation from 'react-native-orientation-locker';
import PropTypes from 'prop-types';
import React, { createRef, useEffect, useState } from 'react';
import { useApolloClient, withApollo } from 'react-apollo';
import { getEmployees, getModules } from '../services/employeeService';
import { useNotificationContext, useUserContext } from '../libraries/StoreContext';
import { RootDrawer, RootStack } from '../Router';
import { SideMenu, Spinner } from '../components';
import { View } from 'react-native';
import SideMenuUpdated from 'react-native-side-menu-updated';

export const navigationRef = createRef();
const prefix = 'sboplus://';

function Navigator() {
  const userStore = useUserContext();
  const notificationStore = useNotificationContext();
  const client = useApolloClient();
  const [loading, setLoading] = useState();

  async function handelGetModules() {
    const results = await getModules(client);
    if (results.status) {
      userStore.setModule(results.data);
    } else {
      userStore.setModule([]);
    }
  }

  useEffect(() => {
    Orientation.lockToPortrait();

    async function handelGetEmployee() {
      setLoading(true);
      const results = await getEmployees(client);
      if (results?.status) {
        userStore.setLogin({ isLogin: true, users: results.data });
        await handelGetModules();
      } else {
        userStore.setLogin({ isLogin: false, users: {} });
      }
      setLoading(false);
    }

    handelGetEmployee();
  }, []);

  function getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  }

  async function changeRoute(prevState, currentState) {
    const currentScreen = getActiveRouteName(currentState);
    const prevScreen = getActiveRouteName(prevState);
    GLOBALS.SCREEN = currentScreen;
    if (prevScreen !== currentScreen) {
      if (currentScreen === 'Notification') {
        if (firebase) {
          // firebase.notifications().setBadge(0);
          // firebase.notifications().removeAllDeliveredNotifications();
        }
        notificationStore.setNotification({ isNotification: false });
      }
      if (currentScreen === 'Home') {
        await handelGetModules();
      }
    }
  }

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    } else {
      if (userStore?.isLogin) {
        return (
          <SideMenuUpdated
            isOpen={userStore.showMenu}
            disableGestures={true}
            onChange={(showMenu) => {
              userStore.setShowMenu(showMenu);
            }}
            overlayColor={'rgba(0,0,0,0.5)'}
            menu={<SideMenu navigation={navigationRef.current} />}
          >
            <RootDrawer
              ref={navigationRef}
              onNavigationStateChange={(prevState, currentState) => {
                changeRoute(prevState, currentState);
              }}
              uriPrefix={prefix}
            />
          </SideMenuUpdated>
        );
      } else {
        return <RootStack uriPrefix={prefix} />;
      }
    }
  };

  return <View style={{ flex: 1 }}>{renderContent()}</View>;
}

Navigator.propTypes = {
  data: PropTypes.object,
};

export default withApollo(Navigator);

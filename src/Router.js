// src/Router.js
import GLOBALS from './Globals';
import I18n from './i18n';

import Icon from 'react-native-vector-icons/Ionicons';
import React, { useContext } from 'react';
import {
  Account,
  Camera,
  ContactUs,
  Home,
  Login,
  Logout,
  Notification,
  Qrcode,
  Register,
  StockCard,
  StockCardItem,
  StockCount,
  StockCountItem,
  StockIn,
  StockOut,
  StockOuting,
  StockOutingItem,
  StockPending,
  StockPendingItem,
  StockProduct,
  WebManual,
} from './pages';
import { alertExit, alertLogout } from './libraries/HandleExit';
import { BadgeNumber, SideMenu } from './components';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { get } from 'lodash';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { UserContext } from './libraries/StoreContext/UserContext';

const goBack = (navigation) => {
  const extraHandel = () => {
    navigation.goBack();
  };
  alertExit({ extraHandel });
};

const backButton = (navigation) => (
  <TouchableOpacity onPress={() => goBack(navigation)} style={styles.headerTitleLeft}>
    <Icon name='arrow-back-outline' size={25} style={{ color: GLOBALS.COLOR_WHITE }} />
  </TouchableOpacity>
);

const withOutBackButton = (navigation) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerTitleLeft}>
    <Icon name='arrow-back-outline' size={25} style={{ color: GLOBALS.COLOR_WHITE }} />
  </TouchableOpacity>
);

const menuButton = (navigation, style = []) => {
  const { showMenu, setShowMenu } = useContext(UserContext);
  return (
    <View style={[styles.headerTitleRight, style]}>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
        <Icon name='menu' size={35} style={{ color: GLOBALS.COLOR_WHITE }} />
      </TouchableOpacity>
    </View>
  );
};

const homeLogo = () => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Image source={require('./assets/logo_white.png')} style={{ width: 100, height: 100 }} />
  </View>
);

const setTabBarVisible = (navigation) => {
  const navState = navigation.state;
  const routeName = navState.routes[navState.index].routeName;
  if (routeName === 'Qrcode' || routeName === 'Camera' || routeName === 'Logout' || routeName === 'WebManual') {
    return false;
  } else if (get(navigation, 'state.routes[1].params.hideKeyboard') === false) {
    return false;
  } else {
    return true;
  }
};

const logoutOption = {
  screen: Logout,
  navigationOptions: () => ({
    header: null,
  }),
};

export const RootStackMain = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_LOGIN'),
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: () => <View />,
        headerLeft: () => <View />,
      }),
    },
    Register: {
      screen: Register,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_REGISTER'),
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: () => <View />,
        headerLeft: () => backButton(navigation),
      }),
    },
  },
  {
    initialRouteName: 'Login',
    mode: 'card',
  }
);

export const RootHome = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => homeLogo(),
        headerStyle: [styles.headerImageStyle],
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => menuButton(navigation, { position: 'relative', top: -29 }),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    Submenu: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title'),
        headerStyle: [styles.headerImageStyle],
        headerTitleStyle: styles.headerTitleBig,
        headerLeft: () => withOutBackButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockCount: {
      screen: StockCount,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_COUNT'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockCountItem: {
      screen: StockCountItem,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockIn: {
      screen: StockIn,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_IN'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockOut: {
      screen: StockOut,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_OUT'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockCard: {
      screen: StockCard,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_CARD'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockCardItem: {
      screen: StockCardItem,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: { ...styles.headerTitleStyle, ...styles.headerTitleSmall },
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockPending: {
      screen: StockPending,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_PENDING'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockPendingItem: {
      screen: StockPendingItem,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_PENDING'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockOuting: {
      screen: StockOuting,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_OUTING'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockOutingItem: {
      screen: StockOutingItem,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_OUTING'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    StockProduct: {
      screen: StockProduct,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MENU_STOCK_PRODUCT'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    Qrcode: {
      screen: Qrcode,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_QRCODE'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    Camera: {
      screen: Camera,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_CAMERA'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => backButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    Logout: logoutOption,
  },
  {
    initialRouteName: 'Home',
    mode: 'card',
  }
);

export const RootNotification = createStackNavigator(
  {
    Notification: {
      screen: Notification,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_NOTIFICATION'),
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => menuButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    Logout: logoutOption,
  },
  {
    initialRouteName: 'Notification',
    mode: 'card',
  }
);

export const RootAccount = createStackNavigator(
  {
    Account: {
      screen: Account,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_ACCOUNT'),
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => menuButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    ContactUs: {
      screen: ContactUs,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_TITLE_CONTACT'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => menuButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    WebManual: {
      screen: WebManual,
      navigationOptions: ({ navigation }) => ({
        title: I18n.t('TEXT_MANUAL_AND_VIDEO'),
        headerTintColor: GLOBALS.COLOR_WHITE,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerLeft: () => menuButton(navigation),
        headerRight: () => <View />,
        headerBackTitle: null,
        headerTruncatedBackTitle: null,
      }),
    },
    Logout: logoutOption,
  },
  {
    initialRouteName: 'Account',
    mode: 'card',
  }
);

export const RootLogout = createStackNavigator(
  {
    Logout: logoutOption,
  },
  {
    initialRouteName: 'Logout',
    mode: 'card',
  }
);

export const RootBottom = createMaterialBottomTabNavigator(
  {
    RootHome: {
      screen: RootHome,
      navigationOptions: ({ navigation, props }) => ({
        tabBarVisible: setTabBarVisible(navigation, props),
        title: I18n.t('TEXT_BOTTOM_HOME'),
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor, focused }) => <Icon name='home' size={24} style={{ color: focused ? GLOBALS.COLOR_MAIN : tintColor }} />,
        tabBarOnPress: ({ defaultHandler }) => {
          alertExit({ defaultHandler });
        },
      }),
    },
    RootNotification: {
      screen: RootNotification,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: setTabBarVisible(navigation),
        title: I18n.t('TEXT_BOTTOM_NOTIFICATION'),
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor, focused }) => (
          <View>
            <BadgeNumber />
            <Icon name='megaphone' size={24} style={{ color: focused ? GLOBALS.COLOR_MAIN : tintColor }} />
          </View>
        ),
        tabBarOnPress: ({ defaultHandler }) => {
          alertExit({ defaultHandler });
        },
      }),
    },
    RootAccount: {
      screen: RootAccount,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: setTabBarVisible(navigation),
        title: I18n.t('TEXT_BOTTOM_ACCOUNT'),
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor, focused }) => <Icon name='person-circle-outline' size={24} style={{ color: focused ? GLOBALS.COLOR_MAIN : tintColor }} />,
        tabBarOnPress: ({ defaultHandler }) => {
          const extraHandel = () => {
            navigation.navigate('Account');
          };
          alertExit({ defaultHandler, extraHandel });
        },
      }),
    },
    RootLogout: {
      screen: RootLogout,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: setTabBarVisible(navigation),
        title: I18n.t('TEXT_TITLE_LOGOUT'),
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ tintColor, focused }) => <Icon name='log-out-outline' size={24} style={{ color: focused ? GLOBALS.COLOR_MAIN : tintColor }} />,
        tabBarOnPress: ({ defaultHandler }) => {
          const extraHandel = () => {
            navigation.navigate('Logout');
          };
          alertLogout({ defaultHandler, extraHandel });
        },
      }),
    },
  },
  {
    initialRouteName: 'RootHome',
    activeColor: GLOBALS.COLOR_WHITE,
    inactiveColor: GLOBALS.COLOR_WHITE,
    barStyle: {
      backgroundColor: GLOBALS.COLOR_MAIN,
    },
  }
);

export const RootDrawerMain = createStackNavigator(
  {
    Home: {
      screen: RootBottom,
    },
    Account: {
      screen: RootBottom,
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
    mode: 'card',
  }
);

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: GLOBALS.COLOR_MAIN,
    borderBottomWidth: 0,
  },
  headerImageStyle: {
    backgroundColor: GLOBALS.COLOR_MAIN,
    borderBottomWidth: 0,
    height: 150,
  },
  headerTitleBig: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 30,
    marginTop: 26,
    color: GLOBALS.COLOR_WHITE,
    flex: 1,
    textAlign: 'center',
  },
  headerTitleStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 20,
    color: GLOBALS.COLOR_WHITE,
    flex: 1,
    textAlign: 'center',
  },
  headerTitleSmall: {
    fontSize: 16,
  },
  headerTitleLeft: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  headerTitleRight: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerTextLeft: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 16,
    color: GLOBALS.COLOR_WHITE,
    marginLeft: 3,
  },
  headerTextRight: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 16,
    color: GLOBALS.COLOR_WHITE,
    marginLeft: 3,
  },
  badgeNumber: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    position: 'absolute',
    right: 3,
    top: 3,
    zIndex: 9999,
  },
});

export const RootStack = createAppContainer(RootStackMain);
export const RootDrawer = createAppContainer(RootDrawerMain);

import DialogBox from './src/components/DialogBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GLOBALS from './src/Globals';
import i18next from 'i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Navigator from './src/libraries/Navigator';
import Notification from './src/libraries/Firebase/Notification';
import React, { useEffect, useState } from 'react';
// import SplashScreen from 'react-native-splash-screen';
import { ApolloProvider } from 'react-apollo';
import { client } from './src/libraries/withApollo';
import { DialogProvider, NotificationProvider, UserProvider } from './src/libraries/StoreContext';
import { StatusBar, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import './src/i18n';

Icon.loadFont();
FontAwesome.loadFont();
LogBox.ignoreAllLogs();

export let reloadScreen;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handelOnloadApp = async () => {
      const lang = await AsyncStorage.getItem('LANG');
      let locale;
      if (lang) {
        locale = lang;
      } else {
        locale = GLOBALS.LANG_DEFAULT;
        AsyncStorage.setItem('LANG', GLOBALS.LANG_DEFAULT);
      }
      i18next.changeLanguage(locale.toLowerCase());
      reloadScreen = setLoading;
      //SplashScreen.hide();
      setLoading(false);
    };

    handelOnloadApp();
  }, []);

  return (
    !loading && (
      <ApolloProvider client={client}>
        <DialogProvider>
          <UserProvider>
            <NotificationProvider>
              <StatusBar barStyle='light-content' />
              <Navigator />
              <Notification />
            </NotificationProvider>
            <DialogBox />
          </UserProvider>
        </DialogProvider>
      </ApolloProvider>
    )
  );
}

export default App;

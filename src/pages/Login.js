// src/pages/Login.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import GLOBALS from '../Globals';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Input, Loading } from '../components';
import { Dimensions, Image, Keyboard, StyleSheet, Text, View } from 'react-native';
import { getModules, loginEmployee } from '../services/employeeService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useApolloClient } from 'react-apollo';
import { ScrollView } from 'react-native';
import { useDialogContext, useUserContext } from '../libraries/StoreContext';
import { useTranslation } from 'react-i18next';

const dimensions = Dimensions.get('window');

function Login() {
  const { t } = useTranslation();
  const client = useApolloClient();
  const userStore = useUserContext();
  const dialogStore = useDialogContext();

  const [showLicense, setShowLicense] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function _keyboardDidShow() {
    setShowLicense(0);
  }

  function _keyboardDidHide() {
    setShowLicense(1);
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  async function handelGetModules() {
    const results = await getModules(client);
    if (results.status) {
      userStore.setModule(results.data);
    } else {
      userStore.setModule([]);
    }
  }

  async function onLogin() {
    if (username.trim() === '' || password.trim() === '') {
      dialogStore.showDialog({
        visible: true,
        format: 'ERROR',
        title: t('ALERT_ERROR'),
        message: t('ALERT_LOGIN'),
      });
    } else {
      setLoading(true);
      const results = await loginEmployee(client, { username, password });
      if (results.status) {
        await AsyncStorage.setItem('accessToken', results.data.access_token);
        await handelGetModules();
        const users = results.data;
        userStore.setLogin({ isLogin: true, users });
      } else {
        dialogStore.showDialog({
          visible: true,
          format: 'ERROR',
          title: t('ALERT_ERROR'),
          message: results.error,
        });
      }
      setLoading(false);
    }
  }

  function renderButton() {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <View style={styles.btnStyle}>
          <Button themes={1} onPress={() => onLogin()}>
            {t('BUTTON_SIGN_IN')}
          </Button>
          {/* <TouchableOpacity
            style={{ marginTop: 10, alignItems: 'flex-end' }}
            onPress={() => {
              const pushAction = StackActions.push({ routeName: 'Register' });
              this.props.navigation.dispatch(pushAction);
            }}
          >
            <Text style={{ textDecorationLine: 'underline' }}>{t('REGISTER')}</Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: GLOBALS.COLOR_WHITE }}>
      <ScrollView>
        <KeyboardAwareScrollView style={styles.scrollStyle}>
          <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logoStyle} />
            <View style={{ width: '80%' }}>
              <Input label={t('TEXT_USERNAME')} placeholder={t('TEXT_USERNAME')} onChangeText={(username) => setUsername(username)} value={username} />
              <Input
                label={t('TEXT_PASSWORD')}
                placeholder={t('TEXT_PASSWORD')}
                onChangeText={(password) => setPassword(password)}
                value={password}
                secureTextEntry={true}
              />

              {renderButton()}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={[styles.txtLicense, { opacity: showLicense }]}>
          {`${t('TEXT_COPYRIGHT')}`} &copy; {`${t('TEXT_COMPANY_YEAR')} ${DeviceInfo.getVersion()}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
    alignItems: 'center',
  },
  scrollStyle: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
    width: '100%',
  },
  txtLicense: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 12,
    color: GLOBALS.COLOR_TITLE,
    marginTop: 60,
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  logoStyle: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginTop: 30,
  },
  btnStyle: {
    marginTop: 30,
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    width: '100%',
  },
});

Login.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default Login;

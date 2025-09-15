// src/pages/Register.js
import database from '@react-native-firebase/database';
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Input, Loading } from '../components';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../libraries';

const dimensions = Dimensions.get('window');

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', confirmPassword: '', loading: false };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow');
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide');
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  async onRegister() {
    const { t } = this.props;
    const { dialogStore } = this.props;
    const { username, password, confirmPassword } = this.state;
    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: t('ALERT_LOGIN') });
    } else {
      this.setState({ loading: true });

      const results = database().ref(`users/${username}`).set({ username, password });
      if (results) {
        dialogStore.showDialog({ visible: true, format: 'SUCCESS', title: t('REGISTER_SUCCESS'), message: t('REGISTER_MESSAGE_SUCCESS') });
        this.setState({ username: '', password: '', confirmPassword: '' });
      } else {
        dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
      }
      this.setState({ loading: false });
    }
  }

  renderButton() {
    const { t } = this.props;
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <View style={styles.btnStyle}>
          <Button refs={(ref) => (this.btnSignUp = ref)} themes={1} onPress={() => this.onRegister()}>
            {t('BUTTON_SIGN_UP')}
          </Button>
        </View>
      );
    }
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1, height: dimensions.height }}>
        <KeyboardAwareScrollView style={styles.scrollStyle}>
          <View style={styles.container}>
            <Text style={styles.titleStyle}>SignUp</Text>
            <View style={{ width: '80%' }}>
              <Input
                refs={(ref) => (this.inputUsername = ref)}
                label={t('TEXT_USERNAME')}
                placeholder={t('TEXT_USERNAME')}
                onChangeText={(username) => this.setState({ username })}
                value={this.state.username}
              />
              <Input
                refs={(ref) => (this.inputPassword = ref)}
                label={t('TEXT_PASSWORD')}
                placeholder={t('TEXT_PASSWORD')}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                secureTextEntry={true}
              />
              <Input
                refs={(ref) => (this.inputPassword = ref)}
                label={t('TEXT_CONFIRM_PASSWORD')}
                placeholder={t('TEXT_CONFIRM_PASSWORD')}
                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                value={this.state.confirmPassword}
                secureTextEntry={true}
              />

              {this.renderButton()}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
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
  titleStyle: {
    fontSize: 30,
    fontWeight: '400',
    color: GLOBALS.COLOR_ACTIVE,
    marginBottom: 20,
    marginTop: 30,
  },
  btnStyle: {
    marginTop: 30,
  },
});

Register.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
};

export default withApollo(withUser(withDialog(withTranslation()(Register))));

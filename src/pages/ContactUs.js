// src/pages/ContactUs.js
import GLOBALS from '../Globals';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Input, Loading } from '../components';
import { Dimensions, Image, Keyboard, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sendContact } from '../services/employeeService';
import { useApolloClient } from 'react-apollo';
import { ScrollView } from 'react-native';
import { useDialogContext } from '../libraries/StoreContext';

const dimensions = Dimensions.get('window');

function ContactUs() {
  const { t } = useTranslation();
  const client = useApolloClient();
  const dialogStore = useDialogContext();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function _keyboardDidShow() {
    //const hideKeyboard = false;
    // props.navigation.setParams({ hideKeyboard });
  }

  function _keyboardDidHide() {
    // const hideKeyboard = true;
    // props.navigation.setParams({ hideKeyboard });
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  async function onSendContact() {
    if (subject.trim() === '' || message.trim() === '') {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: t('ALERT_CONTACT') });
    } else {
      setLoading(true);
      const results = await sendContact(client, { subject, message });
      if (results.status) {
        setSubject('');
        setMessage('');
        dialogStore.showDialog({
          visible: true,
          format: 'SUCCESS',
          title: t('ALERT_SUCCESS'),
          message: t('TEXT_SEND_MESSAGE'),
          handle: () => Keyboard.dismiss(),
        });
      } else {
        dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
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
          <Button themes={1} onPress={() => onSendContact()}>
            {t('BUTTON_OK')}
          </Button>
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
              <Input label={t('TEXT_SUBJECT')} placeholder={t('TEXT_SUBJECT')} onChangeText={(subject) => setSubject(subject)} value={subject} />
              <Input
                label={t('TEXT_MESSAGE')}
                placeholder={t('TEXT_MESSAGE')}
                onChangeText={(message) => setMessage(message)}
                value={message}
                multiline={true}
                inputStyle={{ height: 80, textAlignVertical: 'top' }}
              />
              {renderButton()}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
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
  logoStyle: {
    width: 80,
    height: 80,
    marginTop: 30,
  },
  btnStyle: {
    marginTop: 30,
  },
});

ContactUs.propTypes = {
  client: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default ContactUs;

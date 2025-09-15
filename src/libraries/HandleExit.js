// src/libraries/HandleExit.js
import GLOBALS from '../Globals';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { includes } from 'lodash';
import I18n from '../i18n';

const allowScreen = () => {
  const screen = ['StockCount', 'StockIn', 'StockOut', 'StockCard', 'StockPending', 'StockProduct', 'StockOuting'];
  return !!includes(screen, GLOBALS.SCREEN);
};

export const alertExit = ({ defaultHandler, extraHandel }) => {
  const enabled = allowScreen();
  if (enabled) {
    if (GLOBALS.CHECK_BACK) {
      GLOBALS.CHECK_BACK = false;
      Alert.alert(
        I18n.t('ALERT_CONFIRM'),
        I18n.t('ALERT_CONFIRM_GOOUT_SCREEN'),
        [
          {
            text: I18n.t('BUTTON_CANCEL'),
            onPress: () => {
              GLOBALS.CHECK_BACK = true;
            },
          },
          {
            text: I18n.t('BUTTON_OK'),
            onPress: () => {
              if (defaultHandler) defaultHandler();
              if (extraHandel) extraHandel();
              GLOBALS.CHECK_BACK = true;
            },
          },
        ],
        { cancelable: false }
      );
    }
  } else {
    if (extraHandel) extraHandel();
    if (defaultHandler) defaultHandler();
  }
};

export const alertLogout = ({ defaultHandler, extraHandel }) => {
  Alert.alert(
    I18n.t('ALERT_CONFIRM_LOGOUT'),
    I18n.t('ALERT_LOGOUT'),
    [
      { text: I18n.t('BUTTON_CANCEL'), onPress: () => {} },
      {
        text: I18n.t('BUTTON_OK'),
        onPress: () => {
          if (defaultHandler) defaultHandler();
          if (extraHandel) extraHandel();
        },
      },
    ],
    { cancelable: false }
  );
};

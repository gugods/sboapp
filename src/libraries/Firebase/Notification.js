// src/libraries/Firebase/Notification.js
import DropdownAlert from 'react-native-dropdownalert';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import GLOBALS from '../../Globals';
import React, { useEffect, useRef } from 'react';
// import { Alert } from 'react-native';
import { useNotificationContext } from '../StoreContext';

function Notification() {
  const notificationStore = useNotificationContext();
  const dropdownRef = useRef();

  useEffect(() => {
    async function handelLoadNotification() {
      // requestPermission
      try {
        const enabled = await messaging().hasPermission();

        if (enabled === AuthorizationStatus.DENIED || enabled === AuthorizationStatus.NOT_DETERMINED) {
          try {
            await messaging().requestPermission();
          } catch (error) {
            // console.log(error);
          }
        }
      } catch (error) {
        //Alert.alert(t('ALERT_ERROR'), error.message);
      }

      // getToken
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        messaging().subscribeToTopic('all');
      }

      // onNotification
      messaging().onMessage((message) => {
        if (message.notification) {
          const { notification } = message;
          notificationStore.setNotification({ isNotification: true });

          if (dropdownRef?.current?.alertWithType) {
            dropdownRef.current.alertWithType('info', notification.title, notification.body);
          }
        }
      });

      // notificationOpen
      messaging().onNotificationOpenedApp((notificationOpen) => {
        notificationStore.setNotification({ isNotification: true });
      });

      // notificationOpen
      const notificationOpen = await messaging().getInitialNotification();
      if (notificationOpen) {
        this.notificationStore.setNotification({ isNotification: true });
      }
    }

    handelLoadNotification();
  }, []);

  return <DropdownAlert infoColor={GLOBALS.COLOR_SUCCESS} ref={dropdownRef} />;
}

export default Notification;

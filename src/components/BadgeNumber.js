import GLOBALS from '../Globals';
import React from 'react';
import { NotificationConsumer } from '../libraries/StoreContext';
import { StyleSheet, View } from 'react-native';

class BadgeNumber extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NotificationConsumer>
        {(store) => {
          const { isNotification } = store;
          return (isNotification) ? <View style={styles.badgeNumberStyle} /> : null;
        }}
      </NotificationConsumer>
    );
  }
}

export default BadgeNumber;

const styles = StyleSheet.create({
  badgeNumberStyle: {
    width: 12,
    height: 12,
    backgroundColor: GLOBALS.COLOR_CANCEL,
    borderRadius: 12,
    position: 'absolute',
    right: -5,
    top: 3,
    zIndex: 9999
  }
});

// src/components/Preload.js
import GLOBALS from '../Globals';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const dimensions = Dimensions.get('window');
import { Spinner } from '../components';

const Preload = ({ result }) => {
  if (result.status === true) {
    return null;
  } else if (result.status === false) {
    return (
      <View style={styles.layoutError}>
        <Text style={styles.textError}>{result.error}</Text>
      </View>
    );
  } else {
    return <Spinner />;
  }
};

const styles = StyleSheet.create({
  layoutError: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: dimensions.height,
    width: '100%',
    zIndex: 99999
  },
  textError: {
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_MAIN,
    fontSize: 18
  }
});

export { Preload };

// src/components/Alert.js
import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const dimensions = Dimensions.get('window');
const Alert = ({children, style}) => (
  <View style={[styles.layoutStyle, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  layoutStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: dimensions.height,
    width: '100%',
    zIndex: 99999,
  }
});

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

export { Alert };
// src/components/Loading.js
import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';

const dimensions = Dimensions.get('window');
const Spinner = ({ transparent }) => {
  const backgroundColor = (transparent) ? 'rgba(0,0,0,0)' : '#FFFFFF';
  return (<View style={[styles.LoadingStyle, { backgroundColor }]}>
    <ActivityIndicator size='large' color='#cccccc' />
  </View>);
};

const styles = StyleSheet.create({
  LoadingStyle: {
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

Spinner.propTypes = {
  transparent: PropTypes.bool
};

export { Spinner };
// src/components/Label.js
import GLOBALS from '../Globals';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Label = ({children}) => (
  <View style={styles.labelStyle}>
    <Text style={styles.textStyle}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  labelStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: '400',
    color: GLOBALS.COLOR_ACTIVE
  }
});

Label.propTypes = {
  children: PropTypes.node.isRequired
};

export { Label };
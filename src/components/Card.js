// src/components/Card.js
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Card = ({ children }) => (
  <View style={styles.layoutStyle}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  layoutStyle: {
    flex: 1,
  }
});

Card.propTypes = {
  children: PropTypes.node.isRequired
};

export { Card };
// src/components/CardRow.js
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CardRow = ({ onPress, children, activeOpacity, disabled }) => (
  <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress} disabled={disabled}>
    <View style={styles.layoutStyle}>
      {children}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  layoutStyle: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#f1f1f2',
    shadowOffset: {width: 1, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 1,
  }
});

CardRow.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  activeOpacity: PropTypes.number
};

export { CardRow };
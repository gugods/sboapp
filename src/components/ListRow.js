// src/components/ListSection.js
import GLOBALS from '../Globals';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ListRow = ({ onPress, children, activeOpacity, disabled }) => (
  <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress} disabled={disabled}>
    <View style={styles.layoutStyle}>
      {children}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  layoutStyle: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: GLOBALS.COLOR_LINE,
    flexDirection: 'row',
  }
});

ListRow.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  activeOpacity: PropTypes.number,
  disabled: PropTypes.bool,
};

export { ListRow };
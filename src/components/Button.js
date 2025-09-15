// src/components/Button.js
import GLOBALS from '../Globals';
import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = ({ loading, onPress, children, disabled, style, textStyle }) => (
  <TouchableOpacity onPress={onPress} style={[styles.buttonStyle, style]} disabled={disabled}>
    {loading ? 
      (<ActivityIndicator style={styles.loadingStyle} size='small' color='#cccccc' />) :
      (<Text style={[styles.textStyle, textStyle]}>
        {children}
      </Text>)
    }
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_REG,
    fontSize: 18,
    color: GLOBALS.COLOR_WHITE,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  loadingStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  buttonStyle: {
    backgroundColor: GLOBALS.COLOR_MAIN,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR_MAIN,
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    width: '100%',
  },
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object
};

export { Button };
// src/components/InputNum.js
import GLOBALS from '../Globals';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const InputNum = ({ value, onChangeText, placeholder, secureTextEntry, refs, onFocus, onBlur }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    style={styles.inputStyle}
    autoCorrect={false}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    underlineColorAndroid='transparent'
    placeholderTextColor={GLOBALS.COLOR_SEARCH}
    ref={refs}
    onBlur={onBlur}
    onFocus={onFocus}
    keyboardType='numeric'
    returnKeyType='done'
  />
);

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 16,
    color: GLOBALS.COLOR_DESC,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: GLOBALS.COLOR_GRAY,
    height: 45,
  }
});

InputNum.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  refs: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

export { InputNum };
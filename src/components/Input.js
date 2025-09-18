// src/components/Input.js
import GLOBALS from '../Globals';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  refs,
  onFocus,
  onBlur,
  multiline,
  numberOfLines,
  inputStyle,
  StartInput,
  EndInput,
}) => (
  <View style={styles.containerStyle}>
    <Text style={styles.labelStyle}>{label}</Text>
    <View style={styles.textInputStyle}>
      {StartInput && <StartInput />}
      <TextInput
        multiline={multiline}
        numberOfLines={numberOfLines}
        value={value}
        onChangeText={onChangeText}
        style={[styles.inputStyle, inputStyle]}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={GLOBALS.COLOR_PLACEHOLDER}
        secureTextEntry={secureTextEntry}
        underlineColorAndroid='transparent'
        ref={refs}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {EndInput && <EndInput />}
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_REG,
    fontSize: 16,
    color: GLOBALS.COLOR_TITLE,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: GLOBALS.COLOR_GRAY2,
    height: 40,
  },
  labelStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_REG,
    fontSize: 16,
    color: GLOBALS.COLOR_TITLE,
    marginVertical: 10,
  },
  containerStyle: {
    marginLeft: 5,
    marginRight: 5,
  },
  textInputStyle: {
    position: 'relative',
  },
});

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  refs: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  inputStyle: PropTypes.object,
};

export { Input };

// src/components/InputSearch.js
import GLOBALS from '../Globals';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';
import SearchInput from 'react-native-search-filter';
import { StyleSheet, View } from 'react-native';

const InputSearch = ({ placeholder, onChangeText, style, inputStyle }) => (
  <View style={[styles.searchBox, style]}>
    <Icon name='search' size={18} style={styles.iconSearch} />
    <SearchInput onChangeText={onChangeText} style={[styles.searchInput, inputStyle]} placeholderTextColor='#8b93a2' placeholder={`${placeholder}`} />
  </View>
);

const styles = StyleSheet.create({
  searchBox: {
    paddingHorizontal: 3,
    paddingVertical: 7,
    backgroundColor: GLOBALS.COLOR_GRAY
  },
  searchInput: {
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 0,
    paddingLeft: 30,
    backgroundColor: GLOBALS.COLOR_SECOND,
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_REG,
    color: GLOBALS.COLOR_MAIN,
    fontSize: 14
  },
  iconSearch: {
    color: '#8b93a2',
    marginLeft: 1,
    position: 'absolute',
    left: 15,
    top: 5,
    zIndex: 99999
  }
});

InputSearch.propTypes = {
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string
};

export { InputSearch };

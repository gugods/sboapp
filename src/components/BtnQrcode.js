// src/components/BtnQrcode.js
import GLOBALS from '../Globals';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const BtnQrcode = ({ onPress, style }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btnScan, style]}>
      <Icon name='scan' size={22} style={{ color: '#ffffff', marginLeft: 2 }} />
      <Text style={styles.txtScan}>{t('TEXT_SCAN')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnScan: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 45,
    height: 45,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    zIndex: 999,
  },
  txtScan: {
    fontSize: 10,
    color: GLOBALS.COLOR_WHITE,
    marginTop: -5,
    marginLeft: 1,
  },
});

BtnQrcode.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.object,
};

export { BtnQrcode };

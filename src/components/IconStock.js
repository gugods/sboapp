// src/components/IconStock.js
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';

const IconStock = ({ name }) => {
  if (name === 'QRCODE') {
    return <Icon name='scan' size={20} />;
  } else {
    return <Icon name='information-circle-outline' size={20} />;
  }
};

IconStock.propTypes = {
  name: PropTypes.string
};

export { IconStock };

// src/components/IconStatus.js
import GLOBALS from '../Globals';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';

const IconStatus = ({ status, size }) => {
  size = size ? size : 18;
  if (status) {
    return <Icon name='alert-circle' size={size} color={GLOBALS.COLOR_SUCCESS} />;
  } else if (status === false) {
    return <Icon name='alert-circle' size={size} color={GLOBALS.COLOR_PEDING} />;
  } else {
    return <Icon name='alert-circle' size={size} color={GLOBALS.COLOR_GRAY2} />;
  }
};

IconStatus.propTypes = {
  status: PropTypes.bool,
  size: PropTypes.number
};

export { IconStatus };

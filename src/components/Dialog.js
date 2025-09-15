// src/components/Dialog.js
import GLOBALS from '../Globals';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const dimensions = Dimensions.get('window');

class Dialog extends Component {
  constructor(props) {
    super(props);

    this.state = { isShown: !!props.isShown };
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef && this.props.onRef(undefined);
  }

  open = () => {
    const { onBeforeOpen, onAfterOpen } = this.props;
    onBeforeOpen && onBeforeOpen();
    this.setState({ isShown: true }, () => {
      onAfterOpen && onAfterOpen();
    });
  };

  close = () => {
    const { onBeforeClose, onAfterClose } = this.props;
    onBeforeClose && onBeforeClose();
    this.setState({ isShown: false }, () => {
      onAfterClose && onAfterClose();
    });
  };

  render() {
    const { style, children } = this.props;
    const { isShown } = this.state;
    if (isShown) {
      return (
        <View style={[styles.layoutStyle, style]}>
          <View style={styles.layoutClose}>
            <TouchableOpacity onPress={() => this.close()} style={styles.btnClose}>
              <Icon name='close' size={18} color={GLOBALS.COLOR_MAIN} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  layoutStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: dimensions.height,
    width: '100%',
    zIndex: 99999
  },
  layoutClose: {
    width: '100%',
    alignItems: 'flex-end'
  },
  btnClose: {
    position: 'relative',
    top: 5,
    right: 5,
    backgroundColor: GLOBALS.COLOR_GRAY1,
    borderColor: GLOBALS.COLOR_GRAY1,
    borderRadius: 1000,
    paddingVertical: 6,
    paddingHorizontal: 8,
    zIndex: 9999
  }
});

Dialog.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  isShown: PropTypes.any,
  onBeforeOpen: PropTypes.func,
  onAfterOpen: PropTypes.func,
  onBeforeClose: PropTypes.func,
  onAfterClose: PropTypes.func,
  onRef: PropTypes.func
};

export default Dialog;

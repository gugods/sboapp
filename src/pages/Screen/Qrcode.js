// src/pages/Screen/Qrcode.js
import PropTypes from 'prop-types';
import { Camera as CameraKit, CameraType } from 'react-native-camera-kit';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

export class Qrcode extends Component {
  constructor(props) {
    super(props);
    this.scanFirst = true;
    this.scanner;
  }

  async _onRead(event) {
    if (this.scanFirst) {
      this.scanFirst = false;
      this.props.navigation.state.params.onBackQrcode({ qrcode: event.nativeEvent.codeStringValue });
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CameraKit
          ref={(ref) => {
            this.scanner = ref;
          }}
          style={styles.preview}
          type={CameraType.back}
          flashMode={'auto'}
          scanBarcode={true}
          frameColor='white'
          laserColor={Globals.COLOR_MAIN}
          showFrame={true}
          barcodeFrameSize={{
            width: 300,
            height: 300,
          }}
          onReadCode={this._onRead.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

Qrcode.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Qrcode;

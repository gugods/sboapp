// src/pages/Screen/Qrcode.js
import PropTypes from 'prop-types';
import { Camera as VisionCamera, useCameraPermission, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7; // Adjust as needed

function QRCodeMask() {
  return (
    <View style={styles.overlay}>
      <View style={styles.topOverlay} />
      <View style={styles.middleOverlay}>
        <View style={styles.leftOverlay} />
        <View style={styles.qrFrame} />
        <View style={styles.rightOverlay} />
      </View>
      <View style={styles.bottomOverlay} />
    </View>
  );
}

export const Qrcode = (props) => {
  const { navigation } = props;
  const scanFirst = useRef(true);
  const scanner = useRef(true);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onCodeScanned = useCallback(
    (codes) => {
      if (scanFirst?.current) {
        scanFirst.current = false;
        navigation.state.params.onBackQrcode({ qrcode: codes[0].value });
        navigation.goBack();
      }
    },
    [scanFirst?.current]
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  });

  if (!hasPermission) return <View style={styles.container}></View>;
  if (device == null) return <View style={styles.container}></View>;

  return (
    <View style={styles.container}>
      <VisionCamera ref={scanner} style={StyleSheet.absoluteFill} device={device} isActive={true} codeScanner={codeScanner} enableZoomGesture={true} />
      <QRCodeMask />
    </View>
  );
};

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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleOverlay: {
    flexDirection: 'row',
    height: qrSize,
    width: '100%',
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  qrFrame: {
    width: qrSize,
    height: qrSize,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

Qrcode.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Qrcode;

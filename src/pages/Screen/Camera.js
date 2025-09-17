// src/pages/Screen/Camera.js
import GLOBALS from '../../Globals';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera as VisionCamera, useCameraPermission, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';

const FlashMode = { ON: 'on', OFF: 'off' };

export const Camera = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();

  const camera = useRef();
  const item_index = navigation.getParam('item_index');
  const allow_gallery = navigation.getParam('allow_gallery');

  const [flashMode, setFlashMode] = useState(FlashMode.OFF);
  const [loading, setLoading] = useState(false);

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const format = useCameraFormat(device, [{ photoResolution: { width: 1024, height: 720 }, fps: 60 }]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    if (camera?.current) {
      setLoading(true);
      // const options = { width: 600, quality: 1, base64: false };
      const data = await camera.current.takePhoto();
      setLoading(false);

      navigation.state.params.onBackCamera({ item_file: 'file://' + data.path, item_index });
      navigation.goBack();
    }
  };

  const takeImagePicker = async () => {
    const options = {
      // title: t('TEXT_TITLE_CHOOSE_IMAGE'),
      // takePhotoButtonTitle: null,
      // chooseFromLibraryButtonTitle: `${t('TEXT_CHOOSE_LIBRARY')}…`,
      mediaType: 'photo',
      quality: 1,
      maxWidth: 600,
      selectionLimit: 1,
      // storageOptions: {
      //   skipBackup: true,
      // },
      // tintColor: GLOBALS.COLOR_MAIN,
    };

    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        Alert('ImagePicker Error: ', response.error);
      } else {
        navigation.state.params.onBackCamera({ item_file: response.assets[0].uri, item_index });
        navigation.goBack();
      }
    });
  };

  const onTurnFlash = async () => {
    try {
      if (flashMode === FlashMode.OFF) {
        setFlashMode(FlashMode.ON);
      } else {
        setFlashMode(FlashMode.OFF);
      }
    } catch (e) {
      Alert.alert(t('ALERT_ERROR'), t('ALERT_FLASH_MODE'));
    }
  };

  if (!hasPermission) return <View style={styles.container}></View>;
  if (device == null) return <View style={styles.container}></View>;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onTurnFlash} style={styles.buttonFlash}>
        <Icon name='flash' size={25} style={{ color: '#ffffff' }} />
      </TouchableOpacity>
      <VisionCamera ref={camera} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} format={format} torch={flashMode} />
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <View style={styles.buttonStyle}>
          {loading ? (
            <ActivityIndicator size='small' style={styles.captureStyle} color={GLOBALS.COLOR_MAIN} />
          ) : (
            <TouchableOpacity onPress={takePicture} style={styles.captureStyle} />
          )}
        </View>
        {allow_gallery && (
          <TouchableOpacity onPress={takeImagePicker} style={styles.buttonImage}>
            <Icon name='images' size={35} style={{ color: '#ffffff' }} />
          </TouchableOpacity>
        )}
      </View>
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
  buttonStyle: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    margin: 20,
    backgroundColor: GLOBALS.COLOR_BLACK,
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: GLOBALS.COLOR_WHITE,
    borderWidth: 5,
    padding: 3,
  },
  captureStyle: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  buttonFlash: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 9,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonImage: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    bottom: 50,
    right: 10,
    zIndex: 9,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: -25,
  },
});

Camera.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Camera;

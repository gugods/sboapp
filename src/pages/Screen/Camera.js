// src/pages/Screen/Camera.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera as CameraKit, CameraType } from 'react-native-camera-kit';

const FlashMode = { ON: 'on', OFF: 'off', AUTO: 'auto' };

export class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.camera;
    const { navigation } = this.props;
    this.state = {
      flashMode: FlashMode.OFF,
      stockList: { loading: true, data: {} },
      item_index: navigation.getParam('item_index'),
      loading: false,
      allow_gallery: navigation.getParam('allow_gallery'),
    };
  }

  takePicture = async () => {
    if (this.camera) {
      this.setState({ loading: true });
      // const options = { width: 600, quality: 1, base64: false };
      const data = await this.camera.capture();
      this.setState({ loading: false });

      const { item_index } = this.state;
      this.props.navigation.state.params.onBackCamera({ item_file: data.uri, item_index });
      this.props.navigation.goBack();
    }
  };

  takeImagePicker = async () => {
    const { t } = this.props;
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
        const { item_index } = this.state;
        this.props.navigation.state.params.onBackCamera({ item_file: response.assets[0].uri, item_index });
        this.props.navigation.goBack();
      }
    });
  };

  onTurnFlash = async () => {
    const { t } = this.props;
    const { flashMode } = this.state;
    try {
      if (flashMode === FlashMode.OFF) {
        this.setState({ flashMode: FlashMode.ON });
      } else {
        this.setState({ flashMode: FlashMode.OFF });
      }
    } catch (e) {
      Alert.alert(t('ALERT_ERROR'), t('ALERT_FLASH_MODE'));
    }
  };

  render() {
    const { allow_gallery } = this.state;
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={this.onTurnFlash.bind(this)} style={styles.buttonFlash}>
          <Icon name='flash' size={25} style={{ color: '#ffffff' }} />
        </TouchableOpacity> */}
        <CameraKit
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={CameraType.back}
          flashMode={this.state.flashMode}
          // androidCameraPermissionOptions={{
          //   title: 'Permission to use camera',
          //   message: 'We need your permission to use your camera',
          //   buttonPositive: 'Ok',
          //   buttonNegative: 'Cancel',
          // }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <View style={styles.buttonStyle}>
            {this.state.loading ? (
              <ActivityIndicator size='small' style={styles.captureStyle} color={GLOBALS.COLOR_MAIN} />
            ) : (
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.captureStyle} />
            )}
          </View>
          {allow_gallery && (
            <TouchableOpacity onPress={this.takeImagePicker.bind(this)} style={styles.buttonImage}>
              <Icon name='images' size={35} style={{ color: '#ffffff' }} />
            </TouchableOpacity>
          )}
        </View>
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
  buttonStyle: {
    flex: 0,
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
    top: 5,
    left: 5,
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
    bottom: 10,
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

export default withTranslation()(Camera);

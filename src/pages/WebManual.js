// src/pages/WebManual.js
import GLOBALS from '../Globals';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const hightScreen = Dimensions.get('window').height;
const widthScreen = Dimensions.get('window').width;

function WebManual() {
  const [deviceWidth, setDeviceWidth] = useState(hightScreen);
  const [deviceHeight, setDeviceHeight] = useState(widthScreen);

  const onLayout = () => {
    setDeviceWidth(Dimensions.get('window').width);
    setDeviceHeight(Dimensions.get('window').height);
  };

  function _onError() {
    _onEnd();
  }

  function _onEnd() {}

  function _onBack() {
    _onEnd();
  }

  function _onFullScreen(status) {}

  return (
    <View style={styles.container} onLayout={onLayout}>
      <WebView
        ref={(WEBVIEW_REF) => (WebViewRef = WEBVIEW_REF)}
        style={[styles.WebView, { width: deviceWidth, height: deviceHeight }]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{
          html: `
          <html>
          <body>
          <iframe src="${GLOBALS.MANUAL_URL}" frameborder="0" width="100%" height="${deviceHeight}" />
          </body>
        </html>`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  WebView: {
    flex: 1,
    marginBottom: 0,
  },
});

export default WebManual;

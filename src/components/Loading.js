// src/components/Loading.js
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = () => (
  <View style={styles.LoadingStyle}>
    <ActivityIndicator size='large' color='#cccccc' />
  </View>
);

const styles = StyleSheet.create({
  LoadingStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  }
});

export { Loading };
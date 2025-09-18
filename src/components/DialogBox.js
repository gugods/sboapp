// src/components/DialogBox.js
import Dialog from 'react-native-dialog';
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, Platform, StyleSheet, Text, View, Appearance } from 'react-native';
import { withDialog } from '../libraries';

const colorScheme = Appearance.getColorScheme();

class DialogBox extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  handle() {
    const { dialogStore } = this.props;
    if (dialogStore.handle) dialogStore.handle();
    dialogStore.showDialog({ visible: false });
    if (dialogStore.message && dialogStore.message.search('Sbo Plus') !== -1) {
      setTimeout(() => {
        const link = Platform.OS !== 'ios' ? GLOBALS.PLAY_STORE_URL : GLOBALS.APPLE_STORE_URL;
        Linking.canOpenURL(link).then((supported) => {
          if (supported) {
            Linking.openURL(link);
          } else {
            alert("Don't know how to open URI: " + link);
          }
        });
      }, 200);
    }
  }

  hide() {
    const { dialogStore } = this.props;
    dialogStore.showDialog({ visible: false });
  }

  renderButton = () => {
    const { t } = this.props;
    const { dialogStore } = this.props;
    if (dialogStore.format === 'CONFIRM' || dialogStore.format === 'CONFIRM_SUCCESS' || dialogStore.format === 'CONFIRM_ERROR') {
      return (
        <View style={{ ...styles.footerStyle }}>
          <Dialog.Button style={{ ...styles.buttonStyle, ...styles.buttonTextCancel }} label={t('BUTTON_CANCEL')} onPress={() => this.hide()} />
          <Dialog.Button style={{ ...styles.buttonStyle, ...styles.buttonTextSuccess }} label={t('BUTTON_OK')} onPress={() => this.handle()} />
        </View>
      );
    } else if (dialogStore.format === 'SUCCESS') {
      return (
        <View style={{ ...styles.footerStyle }}>
          <Dialog.Button
            color={styles.buttonTextError.color}
            style={{ ...styles.buttonStyle, ...styles.buttonTextSuccess }}
            label={t('BUTTON_OK')}
            onPress={() => this.handle()}
          />
        </View>
      );
    } else if (dialogStore.format === 'ERROR') {
      return (
        <View style={{ ...styles.footerStyle }}>
          <Dialog.Button style={{ ...styles.buttonStyle, ...styles.buttonTextError }} label={t('BUTTON_OK')} onPress={() => this.hide()} />
        </View>
      );
    } else {
      return (
        <View style={{ ...styles.footerStyle }}>
          <Dialog.Button color={styles.buttonTextError.color} style={{ ...styles.buttonStyle }} label={t('BUTTON_OK')} onPress={() => this.handle()} />
        </View>
      );
    }
  };
  renderTitle() {
    const { dialogStore } = this.props;
    if (dialogStore.format === 'SUCCESS') {
      return <Dialog.Title style={{ ...styles.titleTextStyle, ...styles.titleSuccess }}>{dialogStore.title}</Dialog.Title>;
    } else if (dialogStore.format === 'ERROR') {
      return <Dialog.Title style={{ ...styles.titleTextStyle, ...styles.titleError }}>{dialogStore.title}</Dialog.Title>;
    } else if (dialogStore.format === 'CONFIRM_SUCCESS') {
      return <Dialog.Title style={{ ...styles.titleTextStyle, ...styles.titleSuccess }}>{dialogStore.title}</Dialog.Title>;
    } else if (dialogStore.format === 'CONFIRM_ERROR') {
      return <Dialog.Title style={{ ...styles.titleTextStyle, ...styles.titleError }}>{dialogStore.title}</Dialog.Title>;
    } else {
      return <Dialog.Title style={{ ...styles.titleTextStyle, ...styles.titleStyle }}>{dialogStore.title}</Dialog.Title>;
    }
  }

  render() {
    const { dialogStore } = this.props;
    return (
      <View>
        <Dialog.Container headerStyle={styles.headerStyle} contentStyle={styles.contentStyle} visible={dialogStore.visible} useNativeDriver={true}>
          {this.renderTitle()}
          <Dialog.Description style={{ ...styles.descStyle }}>
            <Text style={styles.descTextStyle}>{dialogStore.message}</Text>
          </Dialog.Description>
          {dialogStore.visible && this.renderButton()}
        </Dialog.Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    padding: 0,
    borderRadius: 6,
  },
  headerStyle: {
    margin: 0,
  },
  descStyle: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  titleStyle: {
    backgroundColor: GLOBALS.COLOR_MAIN,
  },
  titleSuccess: {
    backgroundColor: GLOBALS.COLOR_SUCCESS,
  },
  titleError: {
    backgroundColor: GLOBALS.COLOR_MAIN,
  },
  titleTextStyle: {
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_BOLD,
    color: GLOBALS.COLOR_WHITE,
  },
  descTextStyle: {
    padding: 5,
    fontSize: 14,
    fontFamily: GLOBALS.FONT_NAME,
    color: colorScheme === 'dark' ? GLOBALS.COLOR_GRAY2 : GLOBALS.COLOR_DESC,
  },
  footerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colorScheme === 'dark' ? GLOBALS.COLOR_THEAD : GLOBALS.COLOR_GRAY2,
    paddingBottom: 6,
  },
  buttonStyle: {
    paddingHorizontal: 10,
    fontSize: 18,
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_BOLD,
    width: 150,
  },
  buttonTextStyle: {
    color: GLOBALS.COLOR_MAIN,
  },
  buttonTextSuccess: {
    color: GLOBALS.COLOR_SUCCESS,
  },
  buttonTextError: {
    color: GLOBALS.COLOR_MAIN,
  },
  buttonTextCancel: {
    color: GLOBALS.COLOR_CANCEL,
    borderRightWidth: 1,
    borderRightColor: colorScheme === 'dark' ? GLOBALS.COLOR_THEAD : GLOBALS.COLOR_GRAY2,
  },
});

DialogBox.propTypes = {
  dialogStore: PropTypes.object,
};

export default withDialog(withTranslation()(DialogBox));

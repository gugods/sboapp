// src/components/DialogBox.js
import Dialog, { DialogButton, DialogContent, DialogFooter, DialogTitle, ScaleAnimation } from 'react-native-popup-dialog';
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, Platform, StyleSheet, Text } from 'react-native';
import { withDialog } from '../libraries';

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
        <DialogFooter style={{ flexDirection: 'row' }}>
          <DialogButton style={styles.buttonStyle} textStyle={styles.buttonTextCancel} text={t('BUTTON_CANCEL')} onPress={() => this.hide()} />
          <DialogButton style={styles.buttonStyle} textStyle={styles.buttonTextSuccess} text={t('BUTTON_OK')} onPress={() => this.handle()} />
        </DialogFooter>
      );
    } else if (dialogStore.format === 'SUCCESS') {
      return (
        <DialogFooter style={{ flexDirection: 'row' }}>
          <DialogButton style={styles.buttonStyle} textStyle={styles.buttonTextSuccess} text={t('BUTTON_OK')} onPress={() => this.handle()} />
          <DialogButton
            style={[styles.buttonStyle, { display: 'none' }]}
            textStyle={styles.buttonTextSuccess}
            text={t('BUTTON_OK')}
            onPress={() => this.handle()}
          />
        </DialogFooter>
      );
    } else if (dialogStore.format === 'ERROR') {
      return (
        <DialogFooter style={{ flexDirection: 'row' }}>
          <DialogButton style={styles.buttonStyle} textStyle={styles.buttonTextError} text={t('BUTTON_OK')} onPress={() => this.handle()} />
          <DialogButton
            style={[styles.buttonStyle, { display: 'none' }]}
            textStyle={styles.buttonTextSuccess}
            text={t('BUTTON_OK')}
            onPress={() => this.handle()}
          />
        </DialogFooter>
      );
    } else {
      return (
        <DialogFooter style={{ flexDirection: 'row' }}>
          <DialogButton style={styles.buttonStyle} textStyle={styles.buttonTextSuccess} text={t('BUTTON_OK')} onPress={() => this.handle()} />
          <DialogButton
            style={[styles.buttonStyle, { display: 'none' }]}
            textStyle={styles.buttonTextSuccess}
            text={t('BUTTON_OK')}
            onPress={() => this.handle()}
          />
        </DialogFooter>
      );
    }
  };
  renderTitle() {
    const { dialogStore } = this.props;
    if (dialogStore.format === 'SUCCESS') {
      return <DialogTitle title={dialogStore.title} style={styles.titleSuccess} textStyle={styles.titleTextStyle} />;
    } else if (dialogStore.format === 'ERROR') {
      return <DialogTitle title={dialogStore.title} style={styles.titleError} textStyle={styles.titleTextStyle} />;
    } else if (dialogStore.format === 'CONFIRM_SUCCESS') {
      return <DialogTitle title={dialogStore.title} style={styles.titleSuccess} textStyle={styles.titleTextStyle} />;
    } else if (dialogStore.format === 'CONFIRM_ERROR') {
      return <DialogTitle title={dialogStore.title} style={styles.titleError} textStyle={styles.titleTextStyle} />;
    } else {
      return <DialogTitle title={dialogStore.title} style={styles.titleStyle} textStyle={styles.titleTextStyle} />;
    }
  }

  render() {
    const { dialogStore } = this.props;
    return (
      <Dialog
        width={0.8}
        dialogStyle={this.container}
        visible={dialogStore.visible}
        dialogTitle={this.renderTitle()}
        dialogAnimation={
          new ScaleAnimation({
            toValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
        footer={this.renderButton()}
      >
        <DialogContent>
          <Text style={styles.contentStyle}>{dialogStore.message}</Text>
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
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
    color: GLOBALS.COLOR_WHITE,
    fontSize: 18,
    fontFamily: GLOBALS.FONT_NAME,
  },
  contentStyle: {
    padding: 5,
    fontSize: 14,
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_DESC,
  },
  buttonStyle: {
    borderTopWidth: 1,
    borderTopColor: GLOBALS.COLOR_GRAY,
  },
  buttonTextStyle: {
    fontSize: 18,
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_MAIN,
  },
  buttonTextSuccess: {
    fontSize: 18,
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_SUCCESS,
  },
  buttonTextError: {
    fontSize: 18,
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_MAIN,
  },
  buttonTextCancel: {
    fontSize: 18,
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_CANCEL,
    opacity: 0.7,
  },
});

DialogBox.propTypes = {
  dialogStore: PropTypes.object,
};

export default withDialog(withTranslation()(DialogBox));

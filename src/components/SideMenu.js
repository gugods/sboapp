import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Orientation from 'react-native-orientation-locker';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { get, reduce } from 'lodash';
import { Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { withUser } from '../libraries';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleList: { loading: false, data: [] },
    };
  }

  async _onOpenUrl(url) {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const linkOut = `${url}?accessToken=${accessToken}`;
    Linking.canOpenURL(linkOut).then((supported) => {
      if (supported) {
        Linking.openURL(linkOut);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  navigateToScreen(item) {
    const { userStore } = this.props;
    const { t } = this.props;

    const { module } = item;
    const value = GLOBALS.MENUS[module] ? GLOBALS.MENUS[module] : null;

    if (item.url) {
      Alert.alert(
        t('ALERT_LINK_OUT'),
        t('ALERT_CONFIRM_LINK_OUT', { name: t(value.name) }),
        [
          { text: t('BUTTON_CANCEL'), onPress: () => {} },
          {
            text: t('BUTTON_OK'),
            onPress: () => {
              userStore.setShowMenu(false);
              this._onOpenUrl(item.url);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Orientation.lockToPortrait();
      const navigateAction = NavigationActions.navigate({
        routeName: value.route,
      });

      userStore.setShowMenu(false);
      this.props.navigation.dispatch(navigateAction);
    }
  }

  renderMenu() {
    const { t } = this.props;
    const { userStore } = this.props;

    return get(userStore, 'modules', []).map((item, key) => {
      const { module, submenu } = item;
      const value = GLOBALS.MENUS[module] ? GLOBALS.MENUS[module] : null;

      if (value) {
        return submenu?.length ? (
          <>
            <View style={styles.navItem}>
              <Icon style={styles.iconItem} name={value.icon} size={25} />
              <Text style={styles.textItem}> {t(value.name)}</Text>
            </View>
            {this.renderSubmenu(submenu)}
          </>
        ) : (
          <TouchableOpacity key={key} onPress={() => this.navigateToScreen(item)}>
            <View style={styles.navItem}>
              <Icon style={styles.iconItem} name={value.icon} size={25} />
              <Text style={styles.textItem}> {t(value.name)}</Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    });
  }

  renderSubmenu(submenu) {
    const { t } = this.props;
    return submenu.map((item, key) => {
      const module = item.module;
      const value = GLOBALS.MENUS[module] ? GLOBALS.MENUS[module] : null;
      return (
        value && (
          <TouchableOpacity key={key} onPress={() => this.navigateToScreen(item)}>
            <View style={styles.navItem}>
              <Icon style={styles.iconSubItem} name={'ellipse'} size={8} />
              <Text style={styles.textSubItem}>{t(value.name)}</Text>
            </View>
          </TouchableOpacity>
        )
      );
    });
  }

  openPage(routeName) {
    const { userStore } = this.props;
    routeName === 'WebManual' ? Orientation.unlockAllOrientations() : Orientation.lockToPortrait();
    const navigateAction = NavigationActions.navigate({
      routeName: routeName,
    });
    userStore.setShowMenu(false);
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    const { t } = this.props;
    const { userStore } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeading}>
          <View style={styles.labelStyle}>
            <TouchableOpacity onPress={this.openPage.bind(this, 'Home')}>
              <Image source={require('../assets/logo_white.png')} style={styles.logoStyle} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => userStore.setShowMenu(false)} style={styles.iconClose}>
            <Icon style={{ color: GLOBALS.COLOR_WHITE }} name='close' size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.navSection}>{this.renderMenu()}</View>
        </ScrollView>
        <TouchableOpacity onPress={this.openPage.bind(this, 'WebManual')}>
          <View style={[styles.sectionFooter, { borderTopWidth: 1, borderTopColor: GLOBALS.COLOR_GRAY1, backgroundColor: GLOBALS.COLOR_WHITE }]}>
            <Icon style={[styles.iconFooter, { color: GLOBALS.COLOR_MAIN }]} name='book' size={25} />
            <Text style={[styles.textFooter, { color: GLOBALS.COLOR_MAIN }]}>{t('TEXT_MANUAL_AND_VIDEO')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.openPage.bind(this, 'ContactUs')}>
          <View style={styles.sectionFooter}>
            <Icon style={styles.iconFooter} name='mail' size={20} />
            <Text style={styles.textFooter}>{t('TEXT_CONTACT_US')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
  userStore: PropTypes.object,
};

const styles = {
  container: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
  },
  sectionHeading: {
    height: 100,
    backgroundColor: GLOBALS.COLOR_MAIN,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconClose: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  logoStyle: {
    width: 80,
    height: 80,
  },
  navItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GLOBALS.COLOR_GRAY1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    color: GLOBALS.COLOR_ACTIVE,
    marginRight: 10,
    marginLeft: 5,
    width: 25,
  },
  iconSubItem: {
    color: GLOBALS.COLOR_ACTIVE,
    marginRight: 10,
    marginLeft: 45,
    width: 8,
  },
  textItem: {
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_ACTIVE,
    fontSize: 14,
  },
  textSubItem: {
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_DESC,
    fontSize: 14,
  },
  navSection: {
    backgroundColor: GLOBALS.COLOR_WHITE,
  },
  sectionFooter: {
    paddingHorizontal: 20,
    backgroundColor: GLOBALS.COLOR_ACTIVE,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  iconFooter: {
    color: GLOBALS.COLOR_WHITE,
    marginRight: 10,
  },
  textFooter: {
    fontFamily: GLOBALS.FONT_NAME,
    color: GLOBALS.COLOR_WHITE,
    fontSize: 16,
  },
};

export default withUser(withTranslation()(SideMenu));

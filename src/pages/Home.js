// src/pages/Home.js
import database from '@react-native-firebase/database';
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Dimensions, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { get } from 'lodash';
import { getModules } from '../services/employeeService';
import { StackActions } from 'react-navigation';
import { withApollo } from 'react-apollo';
import { withUser } from '../libraries';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const column = parseInt(width / 2);

class Home extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.disabled = false;
    database()
      .ref('stock_pending/')
      .on('value', async (snapshot) => {
        const { client, userStore } = this.props;
        const results = await getModules(client);
        if (results.status) {
          userStore.setModule(results.data);
        } else {
          userStore.setModule([]);
        }
      });
  }

  _onSelectMenu(route, params) {
    const pushAction = StackActions.push({ routeName: route, params });
    this.props.navigation.dispatch(pushAction);
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

  resetDisabled(obj) {
    setTimeout(function () {
      obj.disabled = false;
    }, 1000);
  }

  handleOnSelectMenu(item) {
    const { t } = this.props;
    if (!this.disabled) {
      this.disabled = true;
      const { submenu } = item || {};
      const value = GLOBALS.MENUS[item.module];
      if (item.url) {
        Alert.alert(
          t('ALERT_LINK_OUT'),
          t('ALERT_CONFIRM_LINK_OUT', { name: t(value.name) }),
          [
            { text: t('BUTTON_CANCEL'), onPress: () => {} },
            {
              text: t('BUTTON_OK'),
              onPress: () => {
                this._onOpenUrl(item.url);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        let route;
        let params;
        if (submenu?.length) {
          params = { title: t(value.name), submenu };
          route = 'Submenu';
        } else {
          route = value.route;
        }
        this._onSelectMenu(route, params);
      }
      this.resetDisabled(this);
    }
  }

  _renderItem(item, index) {
    const { t } = this.props;
    const module = item.module;
    const badgeNumber = item.badge_number;
    const value = GLOBALS.MENUS[module] ? GLOBALS.MENUS[module] : null;
    const marginColumn = index % 2 === 0 ? { marginLeft: 10, marginRight: 10 } : { marginLeft: 10, marginRight: 10 };

    return (
      value && (
        <View style={[{ flexDirection: 'column', alignItems: 'center', marginBottom: 10 }, marginColumn]}>
          {badgeNumber ? (
            <View style={styles.badgeNumberStyle}>
              <Text style={styles.badgeNumberText}>{badgeNumber}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={[styles.colStyle, { width: column - 20, height: 100 }]} onPress={() => this.handleOnSelectMenu(item)}>
            <Icon style={styles.iconItem} name={value.icon} size={50} />
            <Text style={styles.textItem}>{t(value.name)}</Text>
          </TouchableOpacity>
        </View>
      )
    );
  }

  renderContent() {
    const { userStore, navigation } = this.props;
    const { submenu } = get(navigation.state, 'params') || {};
    return submenu?.length ? (
      <FlatList numColumns={2} data={submenu} renderItem={({ item }) => this._renderItem(item)} keyExtractor={(item, index) => index.toString()} />
    ) : (
      <FlatList
        numColumns={2}
        data={get(userStore, 'modules', [])}
        renderItem={({ item }) => this._renderItem(item)}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>{this.renderContent()}</View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
  },
  colStyle: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    alignItems: 'center',
  },
  iconItem: {
    color: GLOBALS.COLOR_ACTIVE,
    marginTop: 5,
    marginBottom: 10,
  },
  textItem: {
    color: GLOBALS.COLOR_DESC,
    fontSize: 14,
    textAlign: 'center',
    width: '100%',
  },
  badgeNumberStyle: {
    position: 'absolute',
    borderRadius: 15,
    backgroundColor: GLOBALS.COLOR_SUCCESS,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_SUCCESS,
    zIndex: 9,
    width: 25,
    height: 25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
  },
  badgeNumberText: {
    color: GLOBALS.COLOR_WHITE,
    fontSize: 12,
  },
});

Home.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  navigation: PropTypes.object,
};

export default withApollo(withUser(withTranslation()(Home)));

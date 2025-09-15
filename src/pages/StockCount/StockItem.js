// src/pages/StockCard/StockItem.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { checkStockCountDate, getHeightScroll } from '../../libraries/Helper';
import { createFilter } from 'react-native-search-filter';
import { deleteStockCount, getStockItemCount } from '../../services/stockCountService';
import { FlatList, Keyboard, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconStock, Table } from '../../components';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../../libraries';

const KEYS_TO_FILTERS = ['fullname', 'date'];
const heightScroll = getHeightScroll();

class StockItem extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.onLoad = false;
    this.state = {
      stockList: { loading: true, data: {} },
      product_desc: navigation.getParam('product_desc'),
      branch_name: navigation.getParam('branch_name'),
      branchs_id: navigation.getParam('branchs_id'),
      products_id: navigation.getParam('products_id'),
      stock_date: navigation.getParam('stock_date'),
      app_roles_id: navigation.getParam('app_roles_id'),
      products: [],
      term: '',
      refreshing: false,
    };
  }

  async componentDidMount() {
    await this.getStockItemCount();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    const hideKeyboard = false;
    if (Platform.OS !== 'ios') {
      this.props.navigation.setParams({ hideKeyboard });
    }
    this.setState({ hideKeyboard });
  }

  _keyboardDidHide() {
    const hideKeyboard = true;
    if (Platform.OS !== 'ios') {
      this.props.navigation.setParams({ hideKeyboard });
    }
    this.setState({ hideKeyboard });
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.getStockItemCount();
    this.setState({ refreshing: false });
  };

  onDeleteProductItem(value) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { product_desc, branchs_id } = this.state;
    const date = moment(value.stock_time).format('DD/MM/YYYY HH:mm');
    let message = `${t('TEXT_PRODUCT')} ${product_desc}\n`;
    message += `${t('TEXT_DATE')} ${date}\n`;
    dialogStore.showDialog({
      visible: true,
      format: 'CONFIRM',
      title: t('ALERT_CONFIRM'),
      message: message + t('ALERT_CONFIRM_DELETE'),
      handle: async () => {
        const results = await deleteStockCount(client, { branchs_id, stock_count_id: value.stock_count_id, item_index: value.item_index });
        if (results.status) {
          await this.getStockItemCount();
          this.props.navigation.state.params.onBackStockItem({ products_id: value.products_id });
          setTimeout(() => {
            dialogStore.showDialog({
              visible: true,
              format: 'SUCCESS',
              title: t('ALERT_SUCCESS'),
              message: t('TEXT_DELETE_COUNT'),
            });
          }, 200);
        } else {
          setTimeout(() => {
            dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
          }, 200);
        }
      },
    });
  }

  async getStockItemCount() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { stockList, branchs_id, products_id, stock_date } = this.state;
    stockList.loading = true;
    this.setState({ stockList });
    const results = await getStockItemCount(client, { branchs_id, products_id, stock_date });

    if (results.status) {
      stockList.data = results.data;
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }

    stockList.loading = false;
    this.setState({ stockList });

    return results.status;
  }

  renderItem(value, index) {
    const stock_date = moment(value.stock_date).format('DD-MM-YYYY');
    return (
      <Table.Tbody
        key={index}
        style={{ paddingBottom: 5 }}
        rowColor={index}
        renderComponent={({ styles }) => (
          <React.Fragment>
            <View style={{ flexDirection: 'row', flex: 1, paddingLeft: 15 }} />
            <View style={{ flexDirection: 'row', flex: 1 }} />
            {checkStockCountDate(stock_date, this.state.app_roles_id) && (
              <TouchableOpacity onPress={() => this.onDeleteProductItem(value)} style={styles.btnDelete}>
                <Icon name='trash-bin' color={GLOBALS.COLOR_MAIN} size={20} />
              </TouchableOpacity>
            )}
          </React.Fragment>
        )}
      >
        <Table.TD style={{ width: '10%', alignItems: 'center' }}>{index + 1}</Table.TD>
        <Table.TD style={{ width: '15%', alignItems: 'center' }}>
          <IconStock name={value.stock_method} />
        </Table.TD>
        <Table.TD style={{ width: '40%', alignItems: 'flex-start' }}> {value.fullname}</Table.TD>
        <Table.TD style={{ width: '35%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
          {value.date}
        </Table.TD>
      </Table.Tbody>
    );
  }

  renderStockItem() {
    const { t } = this.props;
    const { stockList } = this.state;
    if (stockList.loading) {
      return <Table.Loading />;
    }
    if (stockList.data.length > 0) {
      const filtereStore = stockList.data.filter(createFilter(this.state.term, KEYS_TO_FILTERS));
      filtereStore.forEach((value, index) => {
        const stock_time = moment(value.stock_time).format('DD/MM/YYYY HH:mm');
        filtereStore[index].date = stock_time;
      });
      if (filtereStore.length > 0) {
        return (
          <FlatList
            style={{ height: heightScroll + 90 }}
            data={filtereStore}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl title='Pull to refresh' titleColor={GLOBALS.COLOR_DESC} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }
          />
        );
      } else {
        return (
          <Table.Full>
            <Icon name='search' size={18} /> {t('ALERT_NODATA')}
          </Table.Full>
        );
      }
    } else {
      return (
        <Table.Full style={styles.fullStyle} textStyle={{ fontWeight: '500' }}>
          <Icon name='search' size={18} /> {t('ALERT_NODATA')}
        </Table.Full>
      );
    }
  }

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.titleStyle}>
            <View>
              <Text style={styles.txtTitle}>
                {t('TEXT_BRANCH')} {this.state.branch_name}
              </Text>
            </View>
            <View>
              <Text style={styles.txtSubTitle}>
                {t('TEXT_PRODUCT')} {this.state.product_desc}
              </Text>
            </View>
          </View>
          <Table>
            <Table.Thead>
              <Table.TH style={{ width: '10%', alignItems: 'center' }}>#</Table.TH>
              <Table.TH style={{ width: '15%', alignItems: 'center' }}> </Table.TH>
              <Table.TH style={{ width: '40%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }}>
                {' '}
                {t('TEXT_EMPLOYEE')}
              </Table.TH>
              <Table.TH style={{ width: '35%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
                {t('TEXT_DATE')}
              </Table.TH>
            </Table.Thead>
            {this.renderStockItem()}
          </Table>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
    padding: 15,
    paddingTop: 15,
  },
  titleStyle: {
    backgroundColor: GLOBALS.COLOR_GRAY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR_MAIN,
    borderWidth: 2,
  },
  txtTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GLOBALS.COLOR_MAIN,
  },
  txtSubTitle: {
    fontSize: 14,
    color: GLOBALS.COLOR_REMARK,
  },
  fullStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_MAIN,
  },
  btnDelete: {
    position: 'absolute',
    right: 4,
    bottom: 5,
  },
});

StockItem.propTypes = {
  client: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockItem))));

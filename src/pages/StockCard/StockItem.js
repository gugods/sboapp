// src/pages/StockCard/StockItem.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { checkStockInOutDate, getFormatDate, getHeightScroll, getTextStatusPending } from '../../libraries/Helper';
import { createFilter } from 'react-native-search-filter';
import { deleteStockCard, getStockItemSearch } from '../../services/stockCardService';
import { FlatList, Keyboard, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconStock, InputSearch, Table } from '../../components';
import { STATUS_COMPLETED } from '../../libraries/Constant';
import { withApollo } from 'react-apollo';
import { withDialog } from '../../libraries';

const KEYS_TO_FILTERS = ['stock_doc_no', 'fullname', 'date'];
const IN = 'IN';
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
      stock_inout: navigation.getParam('stock_inout'),
      stock_month: navigation.getParam('stock_month'),
      app_roles_id: navigation.getParam('app_roles_id'),
      products: [],
      term: '',
      refreshing: false,
    };
  }

  async componentDidMount() {
    await this.getStockItemSearch();
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
    await this.getStockItemSearch();
    this.setState({ refreshing: false });
  };

  onDeleteProductItem(value) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { product_desc, branchs_id } = this.state;
    const stock_date = moment(value.stock_date).format('DD-MM-YYYY');
    const stock_time = moment(value.stock_date).format('HH:mm');
    const date = getFormatDate(stock_date) + ' ' + stock_time;
    const stock_inout = value.stock_inout === 'IN' ? t('TEXT_RECEIVE') : t('TEXT_PAYOFF');
    let message = `${t('TEXT_PRODUCT')} ${product_desc}\n`;
    message += `${stock_inout}${t('TEXT_DATE')} ${date}\n`;
    dialogStore.showDialog({
      visible: true,
      format: 'CONFIRM',
      title: t('ALERT_CONFIRM'),
      message: message + t('ALERT_CONFIRM_DELETE'),
      handle: async () => {
        const results = await deleteStockCard(client, { branchs_id, stock_show_id: value.stock_show_id });
        if (results.status) {
          await this.getStockItemSearch();
          this.props.navigation.state.params.onBackStockItem({ products_id: value.products_id, stock_inout: value.stock_inout });
          setTimeout(() => {
            dialogStore.showDialog({
              visible: true,
              format: 'SUCCESS',
              title: t('ALERT_SUCCESS'),
              message: t('TEXT_DELETE_STOCK'),
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

  async getStockItemSearch() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { stockList, branchs_id, products_id, stock_inout, stock_month } = this.state;
    stockList.loading = true;
    this.setState({ stockList });
    const results = await getStockItemSearch(client, { branchs_id, products_id, stock_inout, stock_month });

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
    const { t } = this.props;
    const txtColor = value.stock_inout === IN ? GLOBALS.COLOR_SUCCESS : GLOBALS.COLOR_ERROR;
    const stock_date = moment(value.stock_date).format('DD-MM-YYYY');
    const stock_status = getTextStatusPending(value.stock_status);
    const txtColorStatus = stock_status === STATUS_COMPLETED ? GLOBALS.COLOR_SUCCESS : GLOBALS.COLOR_PEDING;
    return (
      <Table.Tbody
        key={index}
        style={{ paddingBottom: 5 }}
        rowColor={index}
        renderComponent={({ styles }) => (
          <React.Fragment>
            <View style={{ flexDirection: 'row', flex: 1, paddingLeft: 15 }}>
              <Text style={[styles.txtRemark, { fontSize: 12 }]}>
                {t('TEXT_DOC_NO')} {value.stock_doc_no}
                {'\n'}
                {t('TEXT_BY')} {value.fullname}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Text style={[styles.txtRemark, { fontSize: 12 }]}>
                {t('TEXT_STATUS')}
                {' : '}
                <Text style={{ color: txtColorStatus }}>{t(`TEXT_${stock_status}`)}</Text>
                {'\n'}
                {t('TEXT_REMARK')} {value.stock_remark}
              </Text>
            </View>
            {checkStockInOutDate(stock_date, this.state.app_roles_id) && (
              <TouchableOpacity onPress={() => this.onDeleteProductItem(value)} style={styles.btnDelete}>
                <Icon name='trash-bin' color={GLOBALS.COLOR_MAIN} size={20} />
              </TouchableOpacity>
            )}
          </React.Fragment>
        )}
      >
        <Table.TD style={{ width: '10%', alignItems: 'center' }}>{index + 1}</Table.TD>
        <Table.TD style={{ width: '10%', alignItems: 'center' }}>
          <IconStock name={value.stock_method} />
        </Table.TD>
        <Table.TD style={{ width: '15%', alignItems: 'center' }} textStyle={{ fontSize: 12, color: txtColor }}>{`${t(`TEXT_${value.stock_inout}`)}`}</Table.TD>
        <Table.TD style={{ width: '30%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>{`${t(`TEXT_${value.stock_type}`)}`}</Table.TD>
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
        const stock_date = moment(value.stock_date).format('DD-MM-YYYY');
        const stock_time = moment(value.stock_date).format('HH:mm');
        filtereStore[index].date = getFormatDate(stock_date) + ' ' + stock_time;
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
          <InputSearch
            style={{ marginTop: 0 }}
            placeholder={`${t('TEXT_DOC_NO')}, ${t('TEXT_DATE')}, ${t('TEXT_EMPLOYEE')}`}
            onChangeText={(term) => this.setState({ term })}
          />
          <Table>
            <Table.Thead>
              <Table.TH style={{ width: '10%', alignItems: 'center' }}>#</Table.TH>
              <Table.TH style={{ width: '10%', alignItems: 'center' }}> </Table.TH>
              <Table.TH style={{ width: '15%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
                {t('TEXT_STATUS')}
              </Table.TH>
              <Table.TH style={{ width: '30%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
                {t('TEXT_TYPE')}
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

export default withApollo(withDialog(withTranslation()(StockItem)));

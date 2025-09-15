// src/pages/StockCount/StockCount.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BtnQrcode, Button, Dialog, IconStock, InputArea, InputDate, InputProduct, InputSearch, Spinner, Table } from '../../components';
import {
  checkStockCountDate,
  filterSumTotal,
  filterTotalActive,
  getFormatDate,
  getHeightScroll,
  getMaxPaddingTop,
  getStockCountDate,
  setFormatDate,
} from '../../libraries/Helper';
import { countItem } from '../../libraries/Array';
import { createFilter } from 'react-native-search-filter';
import { createStockCount, getStockCountProduct, getStockCountQrcode, getStockCountSearch } from '../../services/stockCountService';
import { find, findIndex, remove } from 'lodash';
import { FlatList, Keyboard, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NOT_ZERO, OVER_ZERO } from '../../libraries/Constant';
import { StackActions } from 'react-navigation';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../../libraries';

const KEYS_TO_FILTERS = ['product_code', 'product_name'];
const maxPaddingTop = getMaxPaddingTop();
const heightScroll = getHeightScroll() - 5;

class StockCount extends Component {
  constructor(props) {
    super(props);
    this.onLoad = false;
    this.state = {
      scanLoading: false,
      searchProduct: '',
      stockList: { loading: false, data: [] },
      showProduct: {},
      branch_name: '',
      branchs_id: [],
      products_id: [],
      app_roles_id: 0,
      items: [],
      stock_date: getStockCountDate(),
      hideKeyboard: true,
      isDisabled: true,
      isSave: false,
      refreshing: false,
      fieldFilter: '',
      nextPage: true,
    };
  }

  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    const { users } = this.props.userStore;
    const app_roles_id = users.app_roles_id;
    if (users.branchs_id && !this.onLoad) {
      this.onLoad = true;
      const branchs_id = [];
      const branch_name = users.branch_name;
      branchs_id[0] = users.branchs_id;
      setTimeout(() => {
        this.setState({ branchs_id, branch_name, app_roles_id, isDisabled: false }, async () => await this.getStockSearch());
      }, 100);
    } else if (!this.onLoad) {
      this.onLoad = true;
      setTimeout(() => {
        this.setState({ app_roles_id });
      }, 100);
    }
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

  showScanLoading() {
    this.setState({ scanLoading: true });
  }

  hideScanLoading() {
    this.setState({ scanLoading: false });
  }

  onRefresh = async () => {
    this.setState({ refreshing: true, fieldFilter: '' });
    await this.getStockSearch();
    this.setState({ refreshing: false });
  };

  async getStockSearch() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { stockList, stock_date } = this.state;
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    stockList.loading = true;
    this.setState({ stockList });
    const results = await getStockCountSearch(client, { branchs_id, stock_date });

    if (results.status) {
      stockList.data = results.data;
      stockList.data.map((value) => {
        this.addFilter(value);
      });
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }

    stockList.loading = false;
    this.setState({ stockList });
  }

  async onSelectedProduct(ids_product) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    const products_id = ids_product[0] ? ids_product[0] : 0;
    const { stockList, items, stock_date } = this.state;
    this.setState({ products_id: ids_product });

    if (!find(stockList.data, { products_id })) {
      stockList.loading = true;
      this.setState({ stockList });
      const results = await getStockCountProduct(client, { branchs_id, products_id, stock_date });

      if (results.status) {
        const product = results.data;
        stockList.data.push(product);
        this.onAddProductItem({ product, stock_method: 'MANUAL', qrcode: '' });
        this.onSelectProductItem(product);
      } else {
        dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
      }
      stockList.loading = false;
      this.setState({ stockList });
    } else {
      const product = find(stockList.data, { products_id });
      if (!find(items, { products_id })) {
        this.onAddProductItem({ product, stock_method: 'MANUAL', qrcode: '' });
      }
      this.onSelectProductItem(product);
    }
  }

  onInputProduct() {
    const { t } = this.props;
    const { isDisabled } = this.state;
    const { dialogStore } = this.props;
    if (isDisabled) {
      dialogStore.showDialog({
        visible: true,
        format: 'ERROR',
        title: t('ALERT_WARNING'),
        message: t('ALERT_SELECT_BRANCH'),
      });
    }
  }

  onAddProductItem({ product, stock_method, qrcode }) {
    const items = this.state.items.slice();
    items.push({
      product_code: product.product_code,
      product_name: product.product_name,
      products_id: product.products_id,
      qrcode,
      stock_method,
    });
    this.setState({ items });
  }

  // =================== set state value
  onSelectedBranch(ids_branchs) {
    this.setState({ branchs_id: ids_branchs, isDisabled: false, fieldFilter: '' }, async () => await this.getStockSearch());
  }

  onSelectedItemObjectsChange(ids_branchs) {
    this.setState({ branch_name: ids_branchs[0].name });
  }

  onSelectProductItem(product) {
    this.setState({ showProduct: product }, () => {
      this.Dialog.open();
    });
  }

  onDateChange(stock_date) {
    stock_date = setFormatDate(stock_date);
    this.setState({ stock_date, fieldFilter: '' }, async () => await this.getStockSearch());
  }

  onSelectProdItem(value, stock_inout) {
    const { t } = this.props;
    if (this.state.nextPage) {
      this.setState({ nextPage: false }, () => {
        const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
        const stock_date = this.state.stock_date;
        const branch_name = this.state.branch_name;
        const app_roles_id = this.state.app_roles_id;
        const pushAction = StackActions.push({
          routeName: 'StockCountItem',
          params: {
            title: `${t('TEXT_DATE')}  ${getFormatDate(stock_date)}`,
            product_desc: `${value.product_code} : ${value.product_name}`,
            products_id: value.products_id,
            branchs_id,
            branch_name,
            stock_inout,
            stock_date,
            app_roles_id,
            onBackStockItem: ({ products_id }) => this.onBackStockItem({ products_id }),
          },
        });
        this.props.navigation.dispatch(pushAction);
        setTimeout(() => {
          this.setState({ nextPage: true });
        }, 1000);
      });
    }
  }

  onBackStockItem({ products_id }) {
    const { stockList } = this.state;
    const index = findIndex(stockList.data, { products_id });
    stockList.data[index].stock_counter = stockList.data[index].stock_counter - 1;
    this.setState({ stockList });
  }
  // =================== set state value

  async onSave({ products_id }) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    this.setState({ isSave: true });
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    const products = [];
    const { items, stock_date, stockList } = this.state;

    stockList.data.forEach((value) => {
      if (value.products_id === products_id) {
        const stock_counter = value.stock_counter ? value.stock_counter : 0;
        const stock_count_total = stock_counter + value.stock_receive;
        const stock_item = [];

        let productItems = 0;
        items.map((item) => {
          if (item.products_id === value.products_id) {
            stock_item.push({ stock_method: item.stock_method });
            productItems++;
          }
        });

        if (productItems > 0) {
          products.push({
            products_id: value.products_id,
            stock_amount: value.stock_amount,
            stock_counter: stock_count_total,
            stock_date: stock_date,
            stock_item: stock_item,
          });
        }
      }
    });

    const results = await createStockCount(client, { branchs_id, products_id, products });

    if (results.status) {
      const { stockList } = this.state;

      remove(items, { products_id });
      const index = findIndex(stockList.data, { products_id });
      stockList.data[index] = results.data[0];

      this.setState({ items, products_id: [], stockList }, () => {
        this.Dialog.close();
      });

      dialogStore.showDialog({
        visible: true,
        format: 'SUCCESS',
        title: t('ALERT_SUCCESS'),
        message: t('TEXT_COUNT_STOCK'),
      });
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }
    this.setState({ isSave: false });
  }

  onDeleteProductItem(index) {
    const { t } = this.props;
    const { dialogStore } = this.props;
    dialogStore.showDialog({
      visible: true,
      format: 'CONFIRM',
      title: t('ALERT_CONFIRM'),
      message: t('ALERT_CONFIRM_DELETE'),
      handle: () => {
        const items = this.state.items.slice();
        delete items[index];
        this.setState({ items });
      },
    });
  }

  onScanQrcode = () => {
    const { isDisabled } = this.state;
    if (isDisabled) {
      this.onInputProduct();
    } else {
      const pushAction = StackActions.push({
        routeName: 'Qrcode',
        params: { onBackQrcode: ({ qrcode }) => this.onBackQrcode({ qrcode }) },
      });
      this.props.navigation.dispatch(pushAction);
    }
  };

  async onBackQrcode({ qrcode }) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    this.showScanLoading();
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    const { stock_date } = this.state;
    const results = await getStockCountQrcode(client, { branchs_id, qrcode, stock_date });

    if (results.status) {
      const product = results.data;
      const { stockList } = this.state;
      if (!find(stockList.data, { products_id: product.products_id })) {
        stockList.data.push(product);
        this.setState({ stockList });
      }

      const qrcode = product.product_code;
      const stock_method = 'QRCODE';
      this.onAddProductItem({ product, stock_method, qrcode });
      this.onSelectProductItem(product);
      dialogStore.showDialog({
        visible: true,
        format: 'SUCCESS',
        title: `${t('TEXT_TITLE_QRCODE')} ${t('ALERT_SUCCESS')}`,
        message: `${t('TEXT_ID')} ${qrcode}\n\n${t('TEXT_PRODUCT')} ${product.product_name}`,
      });
    } else {
      dialogStore.showDialog({
        visible: true,
        format: 'CONFIRM_ERROR',
        title: t('ALERT_ERROR'),
        message: results.error,
        handle: () => {
          this.onScanQrcode();
        },
      });
    }
    this.hideScanLoading();
  }

  handlefilterSumTotal(fieldFilter) {
    if (fieldFilter === this.state.fieldFilter) {
      this.setState({ fieldFilter: '' });
    } else {
      this.setState({ fieldFilter });
    }
  }

  renderProductDialog() {
    const { t } = this.props;
    const { showProduct: product, items } = this.state;
    const rows = 1;
    const counter = countItem({ items, field: 'products_id', data: product.products_id });
    return (
      <Dialog onRef={(ref) => (this.Dialog = ref)} style={{ justifyContent: 'flex-start', paddingTop: maxPaddingTop }}>
        <Table style={styles.DialogProd}>
          <Table.Title textStyle={{ fontSize: 16 }}>
            {`${t('TEXT_PRODUCT')} ${product.product_code} : ${product.product_name}`}
            {'\n'}
          </Table.Title>
          <Text style={{ fontSize: 14, color: GLOBALS.COLOR_DESC }}>({`${t('TEXT_ADD_PRODUCT_COUNT')}`})</Text>
          <Table.Added counter={counter} onPress={() => this.onAddProductItem({ product, stock_method: 'MANUAL', qrcode: '' })} />
          <Table.Thead>
            <Table.TH style={{ width: '15%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_AMOUNT')}
            </Table.TH>
            <Table.TH style={{ width: '10%', alignItems: 'center' }}> </Table.TH>
            <Table.TH style={{ width: '65%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_PRODUCT')}
            </Table.TH>
            <Table.TH style={{ width: '10%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_DELETE')}
            </Table.TH>
          </Table.Thead>
          <ScrollView>
            {items.map((value, index) =>
              value.products_id === product.products_id ? (
                <Table.Tbody key={index} rowColor={index}>
                  <Table.TD style={{ width: '15%', alignItems: 'center' }}>{rows}</Table.TD>
                  <Table.TD style={{ width: '10%', alignItems: 'center' }}>
                    <IconStock name={value.stock_method} />
                  </Table.TD>
                  <Table.TD style={{ width: '65%', alignItems: 'flex-start' }}>{`${product.product_code} : ${product.product_name}`}</Table.TD>
                  <Table.Deleted style={{ width: '10%', alignItems: 'center' }} onPress={() => this.onDeleteProductItem(index)} />
                </Table.Tbody>
              ) : null
            )}
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={() => this.Dialog.close()} textStyle={styles.btnTextCancel} style={styles.btnCancel}>
              {t('BUTTON_CANCEL')}
            </Button>
            {counter > 0 && checkStockCountDate(this.state.stock_date, this.state.app_roles_id) && (
              <Button
                loading={this.state.isSave}
                disabled={this.state.isSave}
                onPress={() => this.onSave({ products_id: product.products_id })}
                textStyle={styles.btnTextStyle}
                style={styles.btnSave}
              >
                {t('BUTTON_SAVE')}
              </Button>
            )}
          </View>
        </Table>
      </Dialog>
    );
  }

  addFilter(value) {
    const { items } = this.state;
    value.stock_receive = countItem({ items, field: 'products_id', data: value.products_id });
    value.stock_counter = value.stock_counter ? value.stock_counter : 0;
    value.stock_diff = value.stock_counter - value.stock_amount;

    // filter
    value.filter_amount = filterSumTotal({ count: value.stock_amount, isFilter: OVER_ZERO });
    value.filter_counter = filterSumTotal({ count: value.stock_counter, isFilter: OVER_ZERO });
    value.filter_diff = filterSumTotal({ count: value.stock_diff, isFilter: NOT_ZERO });
  }

  renderItem(value, index) {
    this.addFilter(value);
    const textStyle = value.stock_counter > 0 ? { color: GLOBALS.COLOR_SUCCESS } : {};
    const textDiff = value.stock_diff < 0 ? { color: GLOBALS.COLOR_ERROR } : {};
    const onSelectProdItem = value.stock_counter > 0 ? () => this.onSelectProdItem(value) : null;
    return (
      <Table.Tbody key={index} rowColor={index}>
        <Table.Link onPress={() => this.onSelectProductItem(value)} style={{ width: '40%' }} textStyle={{ fontSize: 12 }}>
          {value.product_code} : {value.product_name}
        </Table.Link>
        <Table.TD style={{ width: '18%', alignItems: 'flex-end' }}> {value.stock_amount} </Table.TD>
        <Table.Link style={{ width: '24%', alignItems: 'flex-end' }} textStyle={textStyle} onPress={onSelectProdItem}>
          {' '}
          {value.stock_counter}{' '}
        </Table.Link>
        <Table.TD style={{ width: '18%', alignItems: 'flex-end' }} textStyle={textDiff}>
          {' '}
          {value.stock_diff}{' '}
        </Table.TD>
      </Table.Tbody>
    );
  }

  renderStockCount() {
    const { t } = this.props;
    const { stockList, fieldFilter } = this.state;
    if (stockList.loading) {
      return <Table.Loading />;
    }
    if (stockList.data.length > 0) {
      let filtereStore = stockList.data.filter(createFilter(this.state.searchProduct, KEYS_TO_FILTERS));
      if (filtereStore.length > 0) {
        if (fieldFilter) {
          filtereStore = filtereStore.filter(createFilter('1', [`filter_${fieldFilter}`]));
        }
        return (
          <FlatList
            style={{ height: heightScroll }}
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
    } else if (this.state.branchs_id[0]) {
      return (
        <Table.Full style={styles.fullStyle} textStyle={{ fontWeight: '500' }}>
          <Icon name='search' size={18} /> {t('TEXT_SEARCH_OR_SCAN_QRCODE_REMARK')}
        </Table.Full>
      );
    } else {
      return (
        <Table.Full style={styles.fullStyle} textStyle={{ fontWeight: '500' }}>
          <Icon name='search' size={18} /> {t('ALERT_SELECT_BRANCH')}
        </Table.Full>
      );
    }
  }

  renderTotal() {
    const { t } = this.props;
    const { stockList, items, fieldFilter } = this.state;
    if (stockList.loading) {
      return null;
    }
    if (stockList.data.length > 0) {
      let total_amount = 0;
      let total_counter = 0;
      stockList.data.forEach((value, index) => {
        value.stock_receive = countItem({ items, field: 'products_id', data: value.products_id });
        const stock_counter = value.stock_counter ? value.stock_counter : 0;
        total_counter += stock_counter;
        total_amount += value.stock_amount;
      });

      const total_diff = total_counter - total_amount;
      const textStyle = total_counter > 0 ? { color: GLOBALS.COLOR_SUCCESS } : {};
      const textDiff = total_diff < 0 ? { color: GLOBALS.COLOR_ERROR } : {};
      const amountActive = filterTotalActive('amount', fieldFilter);
      const counterActive = filterTotalActive('counter', fieldFilter);
      const diffActive = filterTotalActive('diff', fieldFilter);
      return (
        <Table.Thead style={{ marginTop: 5 }}>
          <Table.TH style={{ width: '40%' }} textStyle={{ fontSize: 12 }}>
            {' '}
            {t('TEXT_TOTAL')}
          </Table.TH>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('amount')}
            style={{ width: '18%', alignItems: 'flex-end', ...amountActive.style }}
            textStyle={{ ...amountActive.textStyle }}
          >
            {' '}
            {total_amount}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('counter')}
            style={{ width: '24%', alignItems: 'flex-end', ...counterActive.style }}
            textStyle={{ ...textStyle, ...counterActive.textStyle }}
          >
            {' '}
            {total_counter}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('diff')}
            style={{ width: '18%', alignItems: 'flex-end', ...diffActive.style }}
            textStyle={{ ...textDiff, ...diffActive.textStyle }}
          >
            {' '}
            {total_diff}{' '}
          </Table.Link>
        </Table.Thead>
      );
    }
  }

  render() {
    const { t } = this.props;
    const { isDisabled, scanLoading, hideKeyboard } = this.state;
    return (
      <React.Fragment>
        {scanLoading && <Spinner transparent={true} />}
        <View style={styles.container}>
          <View style={styles.topStyle}>
            <View style={{ width: '50%' }}>
              <InputDate date={this.state.stock_date} onDateChange={this.onDateChange.bind(this)} />
            </View>
            <View style={{ width: '50%' }}>
              <InputArea
                selectedItems={this.state.branchs_id}
                onSelectedItemsChange={this.onSelectedBranch.bind(this)}
                onSelectedItemObjectsChange={this.onSelectedItemObjectsChange.bind(this)}
              />
            </View>
          </View>
          <InputProduct
            disabled={isDisabled}
            onPress={this.onInputProduct.bind(this)}
            selectedItems={this.state.products_id}
            onSelectedItemsChange={this.onSelectedProduct.bind(this)}
          />
          <InputSearch placeholder={`${t('TEXT_SEARCH_PRODUCT_IN_BRANCH')}...`} onChangeText={(searchProduct) => this.setState({ searchProduct })} />
          <Table>
            <Table.Thead>
              <Table.TH style={{ width: '40%' }} textStyle={{ fontSize: 12 }}>
                <Icon name='reader' size={20} /> {t('TEXT_PRODUCT')}
              </Table.TH>
              <Table.TH style={{ width: '18%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }} numberOfLines={1}>
                {t('TEXT_BALANCE')}
              </Table.TH>
              <Table.TH style={{ width: '24%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }} numberOfLines={1}>
                {t('TEXT_COUNTER')}
              </Table.TH>
              <Table.TH style={{ width: '18%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }} numberOfLines={1}>
                {t('TEXT_DIFF')}
              </Table.TH>
            </Table.Thead>
            {this.renderStockCount()}
            {this.renderTotal()}
          </Table>
        </View>
        {this.renderProductDialog()}
        {hideKeyboard && <BtnQrcode onPress={this.onScanQrcode.bind()} />}
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
  DialogProd: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    margin: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    height: 450,
  },
  btnSave: {
    width: 100,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: GLOBALS.COLOR_SUCCESS,
    borderColor: GLOBALS.COLOR_SUCCESS,
  },
  btnTextStyle: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  topStyle: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  fullStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_MAIN,
  },
  btnTextCancel: {
    paddingRight: 10,
    paddingLeft: 10,
    color: GLOBALS.COLOR_CANCEL,
  },
  btnCancel: {
    width: 100,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: 'transparent',
    borderColor: GLOBALS.COLOR_LINE,
  },
});

StockCount.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockCount))));

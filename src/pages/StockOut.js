// src/pages/StockOut.js
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
//import ImageView from 'react-native-image-view';
import ImageView from 'react-native-image-viewing';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { assign, find, findIndex, get, map, remove, trim } from 'lodash';
import { BtnQrcode, Button, Dialog, IconStock, InputArea, InputDate, InputProduct, InputSearch, Spinner, Table } from '../components';
import {
  checkStockInOutDate,
  filterSumTotal,
  filterTotalActive,
  getHeightScroll,
  getMaxPaddingTop,
  getScrollKeyboard,
  setFormatDate,
} from '../libraries/Helper';
import { countItem } from '../libraries/Array';
import { createFilter } from 'react-native-search-filter';
import { createStockOut, getStockOutProduct, getStockOutQrcode, getStockOutSearch } from '../services/stockOutService';
import { FlatList, Keyboard, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OVER_ZERO } from '../libraries/Constant';
import { ReactNativeFile } from 'apollo-upload-client';
import { StackActions } from 'react-navigation';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../libraries';

const KEYS_TO_FILTERS = ['product_code', 'product_name'];
const maxPaddingTop = getMaxPaddingTop();
const heightScroll = getHeightScroll() - 12;
const stock_inout = 'OUT';

class StockOut extends Component {
  constructor(props) {
    const { t } = props;
    super(props);
    this.onLoad = false;
    this.state = {
      scanLoading: false,
      searchProduct: '',
      stockList: { loading: false, data: [] },
      showProduct: {},
      branchs_id: [],
      products_id: [],
      app_roles_id: 0,
      items: [],
      stock_date: moment().format('DD-MM-YYYY'),
      hideKeyboard: true,
      isDisabled: true,
      isSave: false,
      refreshing: false,
      fieldFilter: '',
      options: [{ value: 'OUT-01', label: t('TEXT_OUT-01') }],
    };
  }

  async componentDidMount() {
    const { t } = this.props;
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    const { users } = this.props.userStore;
    const app_roles_id = users.app_roles_id;
    if (users.branchs_id && !this.onLoad) {
      this.onLoad = true;
      const branchs_id = [];
      branchs_id[0] = users.branchs_id;
      setTimeout(() => {
        this.setState({ branchs_id, app_roles_id, isDisabled: false }, async () => await this.getStockSearch());
      }, 100);
    } else if (!this.onLoad) {
      this.onLoad = true;
      setTimeout(() => {
        this.setState({ app_roles_id });
      }, 100);
    }

    if (app_roles_id === 1) {
      // isAdmin
      const options = [
        { value: 'OUT-01', label: t('TEXT_OUT-01') },
        { value: 'OUT-02', label: t('TEXT_OUT-02') },
        { value: 'OUT-03', label: t('TEXT_OUT-03') },
        { value: 'OUT-04', label: t('TEXT_OUT-04') },
        { value: 'OUT-05', label: t('TEXT_OUT-05') },
        { value: 'OUT-06', label: t('TEXT_OUT-06') },
        { value: 'ETC-99', label: t('TEXT_ETC-99') },
      ];
      setTimeout(() => {
        this.setState({ options });
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

  handlefilterSumTotal(fieldFilter) {
    if (fieldFilter === this.state.fieldFilter) {
      this.setState({ fieldFilter: '' });
    } else {
      this.setState({ fieldFilter });
    }
  }

  async getStockSearch() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { stockList, stock_date } = this.state;
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    stockList.loading = true;
    this.setState({ stockList });
    const results = await getStockOutSearch(client, { branchs_id, stock_date });

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
      const results = await getStockOutProduct(client, { branchs_id, products_id, stock_date });

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
    const { dialogStore } = this.props;
    const { isDisabled } = this.state;
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
      stock_remark: '',
      stock_type: '',
    });
    this.setState({ items });
  }

  // =================== set state value
  onSelectedBranch(ids_branchs) {
    this.setState({ branchs_id: ids_branchs, isDisabled: false, fieldFilter: '' }, async () => await this.getStockSearch());
  }

  onSelectProductItem(product) {
    this.setState({ showProduct: product }, () => {
      this.Dialog.open();
    });
  }

  onChangeStockType(index, stock_type) {
    const items = this.state.items.slice();
    items[index].stock_type = stock_type;
    this.setState({ items });
  }

  onChangeTextRemark(index, stock_remark) {
    const items = this.state.items.slice();
    items[index].stock_remark = stock_remark;
    this.setState({ items });
  }

  onChangeTextDocNo(index, stock_doc_no) {
    const items = this.state.items.slice();
    items[index].stock_doc_no = stock_doc_no;
    this.setState({ items });
  }

  onDateChange(products_id, stock_date) {
    const { t } = this.props;
    const { dialogStore } = this.props;
    stock_date = setFormatDate(stock_date);
    const checkDate = checkStockInOutDate(stock_date, this.state.app_roles_id);
    if (checkDate) {
      const { stockList } = this.state;
      stockList.data.forEach((value, index) => {
        if (value.products_id === products_id) {
          stockList.data[index].stock_date = stock_date;
        }
      });
      this.setState({ stockList });
    } else {
      dialogStore.showDialog({
        visible: true,
        format: 'ERROR',
        title: t('ALERT_WARNING'),
        message: t('TEXT_CANNOT_CHOOSE_EXPIRED'),
      });
    }
  }

  checkRequiredProduct({ products_id }) {
    const { t } = this.props;
    let isRequired = false;
    let message = '';
    const { items } = this.state;
    items.forEach((value) => {
      if (value.products_id === products_id) {
        const product_required = `${t('TEXT_PRODUCT')} ${value.product_code} : ${value.product_name}`;
        if (trim(value.stock_type) === '') {
          isRequired = true;
          message = `${t('TEXT_TYPE_REQUIRED')}\n${product_required}`;
          return false;
        } else if (trim(value.stock_type) === 'ETC-99' && trim(value.stock_remark) === '') {
          isRequired = true;
          message = `${t('TEXT_REMARK_REQUIRED')}\n${product_required}`;
          return false;
        } else if (trim(value.stock_doc_no) === '') {
          isRequired = true;
          message = `${t('TEXT_DOC_NO_REQUIRED')}\n${product_required}`;
          return false;
        }
        // } else if (!value.stock_doc_file) {
        //   isRequired = true;
        //   message = `${t('TEXT_DOC_FILE_REQUIRED')}\n${product_required}`;
        //   return false;
        // }
      }
    });
    return { isRequired, message };
  }
  // =================== set state value

  async onSave({ products_id }) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { isRequired, message } = this.checkRequiredProduct({ products_id });
    if (isRequired) {
      dialogStore.showDialog({
        visible: true,
        format: 'ERROR',
        title: t('ALERT_ERROR'),
        message: message,
      });
    } else {
      this.setState({ isSave: true });
      const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
      const products = [];
      const { items, stockList } = this.state;
      const stock_date = [];
      stockList.data.forEach((value, index) => {
        if (value.products_id === products_id) {
          stock_date[value.products_id] = get(value, 'stock_date', moment().format('DD-MM-YYYY'));
        }
      });

      const file = [];
      items.forEach((value, index) => {
        if (value.products_id === products_id) {
          if (value.stock_doc_file) {
            file[index] = new ReactNativeFile({
              index: index,
              uri: value.stock_doc_file,
              name: `stock_doc_file-${index}.jpg`,
              type: 'image/jpeg',
            });
          } else {
            file[index] = null;
          }
          products.push({
            products_id: value.products_id,
            stock_type: value.stock_type,
            stock_inout: stock_inout,
            stock_remark: value.stock_remark,
            stock_method: value.stock_method,
            stock_doc_no: value.stock_doc_no,
            stock_date: stock_date[value.products_id] ? stock_date[value.products_id] : moment().format('DD-MM-YYYY'),
          });
        }
      });

      const results = await createStockOut(client, { branchs_id, products_id, products, file });

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
          message: t('TEXT_SAVE_STOCK'),
        });
      } else {
        dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
      }
      this.setState({ isSave: false });
    }
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

  onCamera = (item_index) => {
    const pushAction = StackActions.push({
      routeName: 'Camera',
      params: {
        item_index,
        allow_gallery: true,
        onBackCamera: ({ item_file, item_index }) => this.onBackCamera({ item_file, item_index }),
      },
    });
    this.props.navigation.dispatch(pushAction);
  };

  onBackCamera({ item_file, item_index }) {
    const { items } = this.state;
    items[item_index].stock_doc_file = item_file;
    this.setState({ items });
  }

  onPreviewImage = (item_index, isVisible) => {
    const { items } = this.state;
    items[item_index].isVisible = isVisible;
    this.setState({ items });
  };

  onScanQrcode = () => {
    const { t } = this.props;
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
    const results = await getStockOutQrcode(client, { branchs_id, qrcode, stock_date });

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

  renderProductDialog() {
    const { t } = this.props;
    const { showProduct: product, items, stockList, hideKeyboard } = this.state;
    const stock = find(stockList.data, { products_id: product.products_id });
    const stock_date = get(stock, 'stock_date', moment().format('DD-MM-YYYY'));
    const rows = 1;

    const counter = countItem({ items, field: 'products_id', data: product.products_id });
    const styleExtra = getScrollKeyboard({ hideKeyboard, maxPaddingTop });
    return (
      <Dialog onRef={(ref) => (this.Dialog = ref)} style={{ ...styleExtra, justifyContent: 'flex-start' }}>
        <Table style={styles.DialogProd}>
          <Table.Title textStyle={{ fontSize: 16 }}>{`${t('TEXT_PRODUCT')} ${product.product_code} : ${product.product_name}`}</Table.Title>
          <InputDate date={stock_date} onDateChange={this.onDateChange.bind(this, product.products_id)} />
          <Table.Added counter={counter} onPress={() => this.onAddProductItem({ product, stock_method: 'MANUAL', qrcode: '' })} />
          <Table.Thead>
            <Table.TH style={{ width: '15%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_AMOUNT')}
            </Table.TH>
            <Table.TH style={{ width: '35%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_TYPE')}
            </Table.TH>
            <Table.TH style={{ width: '10%', alignItems: 'center' }}> </Table.TH>
            <Table.TH style={{ width: '30%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_DOC_NO')}
            </Table.TH>
            <Table.TD style={{ width: '10%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
              {t('TEXT_DELETE')}
            </Table.TD>
          </Table.Thead>
          <ScrollView>
            {items.map((value, index) =>
              value.products_id === product.products_id ? (
                <Table.Tbody
                  key={index}
                  rowColor={index}
                  renderComponent={({ styles }) => (
                    <React.Fragment>
                      <View style={{ flexDirection: 'row', flex: 2, paddingLeft: 15 }}>
                        <Text style={[styles.txtTd, { fontSize: 12 }]}>{t('TEXT_REMARK')}</Text>
                        <Table.Input
                          value={value.stock_remark}
                          onChangeText={(text) => this.onChangeTextRemark(index, text)}
                          style={{ width: '70%', marginLeft: 10, marginRight: 5 }}
                        />
                      </View>
                      <View style={{ flexDirection: 'row', flex: 1, paddingLeft: 5 }}>
                        <TouchableOpacity onPress={() => this.onCamera(index)}>
                          <Icon name='camera' color={GLOBALS.COLOR_MAIN} size={20} />
                        </TouchableOpacity>
                        {value.stock_doc_file ? (
                          <TouchableOpacity onPress={() => this.onPreviewImage(index, true)}>
                            <Text style={[styles.txtTd, { fontSize: 12, marginTop: 2, marginLeft: 5, color: GLOBALS.COLOR_MAIN }]}>
                              {`<<${t('TEXT_DOC_VIEW')}>>`}
                            </Text>
                            <ImageView
                              imageIndex={0}
                              visible={!!value.isVisible}
                              images={[{ uri: value.stock_doc_file }]}
                              style={{ width: 50, height: 50 }}
                              onRequestClose={() => this.onPreviewImage(index, false)}
                            />
                          </TouchableOpacity>
                        ) : (
                          <Text style={[styles.txtTd, { fontSize: 12, marginTop: 2, marginLeft: 5 }]}>{t('TEXT_DOC_FILE')}</Text>
                        )}
                      </View>
                    </React.Fragment>
                  )}
                >
                  <Table.TD style={{ width: '15%', alignItems: 'center' }}>{rows}</Table.TD>
                  <Table.Select
                    placeholder={`${t('TEXT_SELECT')}...`}
                    value={value.stock_type}
                    options={this.state.options}
                    style={{ width: '35%', alignItems: 'flex-start' }}
                    onValueChange={(text) => this.onChangeStockType(index, text)}
                  />
                  <Table.TD style={{ width: '10%', alignItems: 'center' }}>
                    <IconStock name={value.stock_method} />
                  </Table.TD>
                  <Table.Input
                    value={value.stock_doc_no}
                    onChangeText={(text) => this.onChangeTextDocNo(index, text)}
                    style={{ width: '30%', alignItems: 'flex-start' }}
                  />
                  <Table.Deleted style={{ width: '10%', alignItems: 'center' }} onPress={() => this.onDeleteProductItem(index)} />
                </Table.Tbody>
              ) : null
            )}
          </ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <Button onPress={() => this.Dialog.close()} textStyle={styles.btnTextCancel} style={styles.btnCancel}>
              {t('BUTTON_CANCEL')}
            </Button>
            {counter > 0 && (
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
    value.stock_cutoff = countItem({ items, field: 'products_id', data: value.products_id });
    value.stock_balance = value.stock_amount - value.stock_cutoff;

    // filter
    value.filter_amount = filterSumTotal({ count: value.stock_amount, isFilter: OVER_ZERO });
    value.filter_cutoff = filterSumTotal({ count: value.stock_cutoff, isFilter: OVER_ZERO });
    value.filter_balance = filterSumTotal({ count: value.stock_balance, isFilter: OVER_ZERO });
  }

  renderItem(value, index) {
    this.addFilter(value);
    const textStyle = value.stock_cutoff > 0 ? { color: GLOBALS.COLOR_SUCCESS } : {};

    return (
      <Table.Tbody key={index} rowColor={index}>
        <Table.Link onPress={() => this.onSelectProductItem(value)} style={{ width: '44%' }} textStyle={{ fontSize: 12 }}>
          {value.product_code} : {value.product_name}
        </Table.Link>
        <Table.TD style={{ width: '20%', alignItems: 'flex-end' }}> {value.stock_amount} </Table.TD>
        <Table.TD style={{ width: '18%', alignItems: 'flex-end' }} textStyle={textStyle}>
          {' '}
          {value.stock_cutoff}{' '}
        </Table.TD>
        <Table.TD style={{ width: '18%', alignItems: 'flex-end' }}> {value.stock_balance} </Table.TD>
      </Table.Tbody>
    );
  }

  renderStockOut() {
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
      let total_cutoff = 0;
      let total_balance = 0;
      stockList.data.forEach((value, index) => {
        value.stock_cutoff = countItem({ items, field: 'products_id', data: value.products_id });
        total_balance += value.stock_amount - value.stock_cutoff;
        total_amount += value.stock_amount;
        total_cutoff += value.stock_cutoff;
      });

      const textStyle = total_cutoff > 0 ? { color: GLOBALS.COLOR_SUCCESS } : {};
      const amountActive = filterTotalActive('amount', fieldFilter);
      const cutoffActive = filterTotalActive('cutoff', fieldFilter);
      const balanceActive = filterTotalActive('balance', fieldFilter);
      return (
        <Table.Thead style={{ marginTop: 5 }}>
          <Table.TH style={{ width: '44%' }} textStyle={{ fontSize: 12 }}>
            {' '}
            {t('TEXT_TOTAL')}
          </Table.TH>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('amount')}
            style={{ width: '20%', alignItems: 'flex-end', ...amountActive.style }}
            textStyle={{ ...amountActive.textStyle }}
          >
            {' '}
            {total_amount}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('cutoff')}
            style={{ width: '18%', alignItems: 'flex-end', ...cutoffActive.style }}
            textStyle={{ ...textStyle, ...cutoffActive.textStyle }}
          >
            {' '}
            {total_cutoff}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('balance')}
            style={{ width: '18%', alignItems: 'flex-end', ...balanceActive.style }}
            textStyle={{ ...balanceActive.textStyle }}
          >
            {' '}
            {total_balance}{' '}
          </Table.Link>
        </Table.Thead>
      );
    }
  }

  render() {
    const { t } = this.props;
    const { isDisabled, scanLoading, hideKeyboard, stock_date } = this.state;
    return (
      <React.Fragment>
        {scanLoading && <Spinner transparent={true} />}
        <View style={styles.container}>
          <View style={styles.topStyle}>
            <View style={{ width: '50%' }}>
              <InputDate date={stock_date} disabled={true} />
            </View>
            <View style={{ width: '50%' }}>
              <InputArea selectedItems={this.state.branchs_id} onSelectedItemsChange={this.onSelectedBranch.bind(this)} />
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
              <Table.TH style={{ width: '44%' }} textStyle={{ fontSize: 12 }}>
                <Icon name='logo-dropbox' size={20} /> {t('TEXT_PRODUCT')}
              </Table.TH>
              <Table.TH style={{ width: '20%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }} numberOfLines={2}>
                {t('TEXT_BALANCE_PAYOFF')}
              </Table.TH>
              <Table.TH style={{ width: '18%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }}>
                {t('TEXT_CUTOFF')}
              </Table.TH>
              <Table.TH style={{ width: '18%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }}>
                {t('TEXT_BALANCE')}
              </Table.TH>
            </Table.Thead>
            {this.renderStockOut()}
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
});

StockOut.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockOut))));

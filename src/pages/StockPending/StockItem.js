// src/pages/StockItem.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, InputDate, InputDateText, Table } from '../../components';
import { checkStockInOutDate, getDBFormatDate, getHeightScroll, setDBFormatDate, setFormatDate } from '../../libraries/Helper';
import { COMPLETED, PENDING } from '../../libraries/Constant';
import { countItem } from '../../libraries/Array';
import { createFilter } from 'react-native-search-filter';
import { createStockPending, getStockPendingProduct } from '../../services/stockPendingService';
import { FlatList, Keyboard, Platform, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { get } from 'lodash';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../../libraries';

const KEYS_TO_FILTERS = ['product_code', 'product_name'];
const heightScroll = getHeightScroll() + 25;

class StockItem extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.onLoad = false;
    this.state = {
      searchProduct: '',
      stockList: { loading: false, data: [] },
      branch_name: navigation.getParam('branch_name'),
      branchs_id: navigation.getParam('branchs_id'),
      stock_date: navigation.getParam('stock_date'),
      stock_type: navigation.getParam('stock_type'),
      stock_doc_no: navigation.getParam('stock_doc_no'),
      app_roles_id: navigation.getParam('app_roles_id'),
      stock_date_all: navigation.getParam('stock_date'),
      isDisabled: true,
      isSave: false,
      refreshing: false,
    };
  }

  async componentDidMount() {
    await this.getStockPendingProduct();
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
    await this.getStockPendingProduct();
    this.setState({ refreshing: false });
  };

  async getStockPendingProduct() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { stockList, branchs_id, stock_date, stock_type, stock_doc_no } = this.state;
    stockList.loading = true;
    this.setState({ stockList });
    const results = await getStockPendingProduct(client, { branchs_id, stock_date, stock_type, stock_doc_no });

    if (results.status) {
      stockList.data = results.data;
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }

    stockList.loading = false;
    this.setState({ stockList });
  }

  // =================== set state value

  onDateChange(index, stock_date) {
    const { t } = this.props;
    const { dialogStore } = this.props;
    stock_date = setFormatDate(stock_date);
    const stock_date_all = stock_date;
    const checkDate = checkStockInOutDate(stock_date, this.state.app_roles_id);
    if (checkDate) {
      stock_date = setDBFormatDate(stock_date);
      if (index === null) {
        const { stockList } = this.state;
        stockList.data.map((value, index) => {
          if (value.stock_status === PENDING) {
            stockList.data[index].confirm_date = stock_date;
          }
        });
        this.setState({ stockList, stock_date_all });
      } else {
        const { stockList } = this.state;
        stockList.data[index].confirm_date = stock_date;
        this.setState({ stockList });
      }
    } else {
      dialogStore.showDialog({
        visible: true,
        format: 'ERROR',
        title: t('ALERT_WARNING'),
        message: t('TEXT_CANNOT_CHOOSE_EXPIRED'),
      });
    }
  }

  // =================== set state value

  async onSave() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;

    this.setState({ isSave: true });
    const branchs_id = this.state.branchs_id;
    const products = [];
    const { stockList, stock_type, stock_doc_no, stock_date } = this.state;

    stockList.data.map((item) => {
      if (item.checked === true && item.stock_status === PENDING) {
        const stock_date = item.confirm_date ? item.confirm_date : item.stock_date;
        products.push({
          stock_pending_id: item.stock_pending_id,
          products_id: item.products_id,
          stock_date,
        });
      }
    });

    const results = await createStockPending(client, { branchs_id, products });

    if (results.status) {
      const data = results.data;
      this.setState({ stockList: { loading: false, data } });
      let stock_status = COMPLETED;
      data.map((value) => {
        if (value.stock_status !== COMPLETED) {
          stock_status = PENDING;
        }
      });

      this.props.navigation.state.params.onBackStockItem({
        stock_doc_no,
        stock_type,
        stock_date: setDBFormatDate(stock_date),
        stock_status,
      });

      dialogStore.showDialog({
        visible: true,
        format: 'SUCCESS',
        title: t('ALERT_SUCCESS'),
        message: t('TEXT_SAVE_PENDING'),
      });
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }
    this.setState({ isSave: false });
  }

  onCancel() {
    const { stockList } = this.state;
    stockList.data.map((value, index) => {
      stockList.data[index].checked = false;
    });
    this.setState({ stockList });
  }

  onCheckProductItem(index) {
    const { t } = this.props;
    const { dialogStore } = this.props;
    const { stockList } = this.state;
    let stock_date = stockList.data[index].confirm_date ? stockList.data[index].confirm_date : stockList.data[index].stock_date;
    stock_date = getDBFormatDate(stock_date);
    const checkDate = checkStockInOutDate(stock_date, this.state.app_roles_id);
    if (checkDate) {
      stockList.data[index].checked = !stockList.data[index].checked;
      this.setState({ stockList });
    } else {
      stockList.data[index].checked = false;
      this.setState({ stockList });
      dialogStore.showDialog({
        visible: true,
        format: 'ERROR',
        title: t('ALERT_WARNING'),
        message: t('TEXT_CANNOT_CHOOSE_EXPIRED'),
      });
    }
  }

  renderItem(value, index) {
    value.confirm_date = value.confirm_date ? value.confirm_date : value.stock_date;
    const disabled = value.stock_status === COMPLETED;
    const bgstyle = disabled ? { opacity: 0.5 } : {};
    const txtStyle = disabled ? { fontSize: 12, color: GLOBALS.COLOR_DESC } : { fontSize: 12, color: GLOBALS.COLOR_MAIN };
    const checked = disabled ? true : value.checked;
    return (
      <Table.Tbody key={index} rowColor={index} style={bgstyle}>
        <Table.Checkbox
          disabled={disabled}
          style={{ width: '12%', alignItems: 'center', marginTop: -5 }}
          checked={checked}
          onChange={() => this.onCheckProductItem(index)}
        />
        <Table.TD style={{ width: '50%' }} textStyle={txtStyle}>
          {value.product_code} : {value.product_name}
        </Table.TD>
        <Table.Component style={{ width: '23%', alignItems: 'flex-start', paddingTop: 10 }}>
          <InputDateText disabled={disabled} date={moment(value.confirm_date).format('DD-MM-YYYY')} onDateChange={this.onDateChange.bind(this, index)} />
        </Table.Component>
        <Table.TD style={{ width: '15%', alignItems: 'flex-end' }} textStyle={txtStyle}>
          {' '}
          {value.stock_amount}{' '}
        </Table.TD>
      </Table.Tbody>
    );
  }

  renderStockPending() {
    const { t } = this.props;
    const { stockList } = this.state;
    if (stockList.loading) {
      return <Table.Loading />;
    }
    if (stockList.data.length > 0) {
      const filtereStore = stockList.data.filter(createFilter(this.state.searchProduct, KEYS_TO_FILTERS));
      if (filtereStore.length > 0) {
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
          <Icon name='search' size={18} /> {t('ALERT_NODATA')}
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
    const { stockList } = this.state;
    if (stockList.loading) {
      return null;
    }
    if (stockList.data.length > 0) {
      let total_amount = 0;

      stockList.data.forEach((value, index) => {
        total_amount += value.stock_amount;
      });

      return (
        <Table.Thead style={{ marginTop: 5 }}>
          <Table.TH style={{ width: '85%' }} textStyle={{ fontSize: 12 }}>
            {' '}
            {t('TEXT_TOTAL')}
          </Table.TH>
          <Table.TD style={{ width: '15%', alignItems: 'flex-end' }}> {total_amount} </Table.TD>
        </Table.Thead>
      );
    }
  }

  render() {
    const { t } = this.props;
    const { stock_date, stock_date_all, branch_name, stock_type, stock_doc_no, stockList } = this.state;
    const items = stockList.data;
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.topStyle}>
            <View style={{ width: '50%' }}>
              <InputDate date={stock_date} disabled={true} />
            </View>
            <View style={{ width: '50%' }}>
              <Text style={styles.titleStyle} numberOfLines={1}>
                {t('TEXT_DOC_NO')} {stock_doc_no}
              </Text>
            </View>
          </View>
          <View style={styles.topStyle}>
            <View style={{ width: '55%', paddingRight: 10 }}>
              <Text style={styles.titleStyle} numberOfLines={1}>
                {t('TEXT_BRANCH')} {branch_name}
              </Text>
            </View>
            <View style={{ width: '45%' }}>
              <Text style={styles.titleStyle} numberOfLines={1}>
                {t('TEXT_TYPE')} {`${t(`TEXT_${stock_type}`)}`}
              </Text>
            </View>
          </View>
          <Table>
            <Table.Thead>
              <Table.TH style={{ width: '12%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
                {t('TEXT_SELECT')}
              </Table.TH>
              <Table.TH style={{ width: '50%' }} textStyle={{ fontSize: 12 }}>
                <Icon name='time' size={18} /> {t('TEXT_PRODUCT')}
              </Table.TH>
              <Table.Component style={{ width: '23%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }}>
                <Text style={styles.btnDate}>{t('TEXT_DATE_IN')}</Text>
                <InputDateText date={stock_date_all} hide={true} onDateChange={this.onDateChange.bind(this, null)} />
              </Table.Component>
              <Table.TH style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 12 }}>
                {t('TEXT_AMOUNT')}
              </Table.TH>
            </Table.Thead>
            {this.renderStockPending()}
            {this.renderTotal()}
          </Table>
          {countItem({ items, field: 'checked', data: true }) > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button onPress={() => this.onCancel()} textStyle={styles.btnTextCancel} style={styles.btnCancel}>
                {t('BUTTON_CANCEL')}
              </Button>
              <Button
                loading={this.state.isSave}
                disabled={this.state.isSave}
                onPress={() => this.onSave()}
                textStyle={styles.btnTextStyle}
                style={styles.btnSave}
              >
                {t('BUTTON_SAVE')}
              </Button>
            </View>
          )}
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
  DialogProd: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    margin: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    height: 450,
  },
  btnSave: {
    width: 100,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: GLOBALS.COLOR_SUCCESS,
    borderColor: GLOBALS.COLOR_SUCCESS,
  },
  btnTextStyle: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  btnDate: {
    color: GLOBALS.COLOR_WHITE,
    fontSize: 12,
    position: 'absolute',
    backgroundColor: GLOBALS.COLOR_MAIN,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft: 20,
    width: '100%',
  },
  titleStyle: {
    backgroundColor: GLOBALS.COLOR_GRAY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR_MAIN,
    borderWidth: 1,
    fontSize: 14,
    color: GLOBALS.COLOR_MAIN,
  },
  txtTitle: {
    fontSize: 14,
    color: GLOBALS.COLOR_MAIN,
  },
  topStyle: {
    flexDirection: 'row',
    marginBottom: 5,
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
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
    borderColor: GLOBALS.COLOR_LINE,
  },
});

StockItem.propTypes = {
  client: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockItem))));

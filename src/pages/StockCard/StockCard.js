// src/pages//StockCard/StockCard.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createFilter } from 'react-native-search-filter';
import { filterSumTotal, filterTotalActive, getCurrentMonth, getHeightScroll, getMonthName } from '../../libraries/Helper';
import { findIndex } from 'lodash';
import { FlatList, Keyboard, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { getStockCardSearch } from '../../services/stockCardService';
import { InputArea, InputMonth, InputSearch, Table } from '../../components';
import { OVER_ZERO } from '../../libraries/Constant';
import { StackActions } from 'react-navigation';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../../libraries';

const KEYS_TO_FILTERS = ['product_code', 'product_name'];
const IN = 'IN';
const OUT = 'OUT';
const CURRENT_MONTH = getCurrentMonth();
const heightScroll = getHeightScroll() + 80;

class StockCard extends Component {
  constructor(props) {
    super(props);
    this.onLoad = false;
    this.state = {
      searchProduct: '',
      stockList: { loading: false, data: {} },
      app_roles_id: 0,
      branchs_id: [],
      branch_name: '',
      stock_month: [],
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
        this.setState({ branchs_id, branch_name, app_roles_id }, async () => await this.getStockCardSearch());
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
  // =================== set state value
  onSelectedBranch(ids_branchs) {
    this.setState({ branchs_id: ids_branchs, fieldFilter: '' }, async () => await this.getStockCardSearch());
  }

  onSelectedMonth(stock_months) {
    this.setState({ stock_month: stock_months, fieldFilter: '' }, async () => await this.getStockCardSearch());
  }

  onSelectedItemObjectsChange(ids_branchs) {
    this.setState({ branch_name: ids_branchs[0].name });
  }

  onSelectProdItem(value, stock_inout) {
    if (this.state.nextPage) {
      this.setState({ nextPage: false }, () => {
        const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
        const stock_month = this.state.stock_month[0] ? this.state.stock_month[0] : CURRENT_MONTH;
        const branch_name = this.state.branch_name;
        const app_roles_id = this.state.app_roles_id;
        const pushAction = StackActions.push({
          routeName: 'StockCardItem',
          params: {
            title: getMonthName(stock_month),
            product_desc: `${value.product_code} : ${value.product_name}`,
            products_id: value.products_id,
            branchs_id,
            branch_name,
            stock_inout,
            stock_month,
            app_roles_id,
            onBackStockItem: ({ products_id, stock_inout }) => this.onBackStockItem({ products_id, stock_inout }),
          },
        });
        this.props.navigation.dispatch(pushAction);
        setTimeout(() => {
          this.setState({ nextPage: true });
        }, 1000);
      });
    }
  }

  onBackStockItem({ products_id, stock_inout }) {
    const { stockList } = this.state;
    const index = findIndex(stockList.data, { products_id });
    if (stock_inout === IN) {
      stockList.data[index].stock_amount_in = stockList.data[index].stock_amount_in - 1;
    } else {
      stockList.data[index].stock_amount_out = stockList.data[index].stock_amount_out - 1;
    }
    this.setState({ stockList });
  }
  // =================== set state value

  onRefresh = async () => {
    this.setState({ refreshing: true, fieldFilter: '' });
    await this.getStockCardSearch();
    this.setState({ refreshing: false });
  };

  handlefilterSumTotal(fieldFilter) {
    if (fieldFilter === this.state.fieldFilter) {
      this.setState({ fieldFilter: '' });
    } else {
      this.setState({ fieldFilter });
    }
  }

  async getStockCardSearch() {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const { stockList } = this.state;
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    const stock_month = this.state.stock_month[0] ? this.state.stock_month[0] : CURRENT_MONTH;
    stockList.loading = true;
    this.setState({ stockList });
    const results = await getStockCardSearch(client, { branchs_id, stock_month });
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

  addFilter(value) {
    value.stock_balance = value.stock_amount + value.stock_amount_in - value.stock_amount_out;

    // filter
    value.filter_amount = filterSumTotal({ count: value.stock_amount, isFilter: OVER_ZERO });
    value.filter_amount_in = filterSumTotal({ count: value.stock_amount_in, isFilter: OVER_ZERO });
    value.filter_amount_out = filterSumTotal({ count: value.stock_amount_out, isFilter: OVER_ZERO });
    value.filter_balance = filterSumTotal({ count: value.stock_balance, isFilter: OVER_ZERO });
  }

  renderItem(value, index) {
    this.addFilter(value);
    const textColor = value.stock_balance < 0 ? GLOBALS.COLOR_ERROR : GLOBALS.COLOR_SUCCESS;
    const onSelectProdItemIn = value.stock_amount_in > 0 ? () => this.onSelectProdItem(value, IN) : null;
    const onSelectProdItemOut = value.stock_amount_out > 0 ? () => this.onSelectProdItem(value, OUT) : null;
    return (
      <Table.Tbody key={index} rowColor={index}>
        <Table.TD style={{ width: '40%' }} textStyle={{ fontSize: 12 }}>
          {value.product_code} : {value.product_name}
        </Table.TD>
        <Table.TD style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 12 }}>
          {' '}
          {value.stock_amount}{' '}
        </Table.TD>
        <Table.Link style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 12 }} onPress={onSelectProdItemIn}>
          {' '}
          {value.stock_amount_in}{' '}
        </Table.Link>
        <Table.Link style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 12 }} onPress={onSelectProdItemOut}>
          {' '}
          {value.stock_amount_out}{' '}
        </Table.Link>
        <Table.TD style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 12, color: textColor }}>
          {' '}
          {value.stock_balance}{' '}
        </Table.TD>
      </Table.Tbody>
    );
  }

  renderStockCard() {
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
    const { stockList, fieldFilter } = this.state;
    if (stockList.loading) {
      return null;
    }
    if (stockList.data.length > 0) {
      let total_amount = 0;
      let total_amount_in = 0;
      let total_amount_out = 0;
      let total_balance = 0;
      stockList.data.forEach((value, index) => {
        total_amount += value.stock_amount;
        total_amount_in += value.stock_amount_in;
        total_amount_out += value.stock_amount_out;
        total_balance += value.stock_amount + value.stock_amount_in - value.stock_amount_out;
      });
      const textColor = total_balance < 0 ? GLOBALS.COLOR_ERROR : GLOBALS.COLOR_SUCCESS;
      const amountActive = filterTotalActive('amount', fieldFilter);
      const amountInActive = filterTotalActive('amount_in', fieldFilter);
      const amountOutActive = filterTotalActive('amount_out', fieldFilter);
      const balanceActive = filterTotalActive('balance', fieldFilter);
      return (
        <Table.Thead style={{ marginTop: 5 }}>
          <Table.TH style={{ width: '40%' }} textStyle={{ fontSize: 12 }}>
            {' '}
            {t('TEXT_TOTAL')}
          </Table.TH>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('amount')}
            style={{ width: '15%', alignItems: 'flex-end', ...amountActive.style }}
            textStyle={{ fontSize: 12, ...amountActive.textStyle }}
          >
            {' '}
            {total_amount}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('amount_in')}
            style={{ width: '15%', alignItems: 'flex-end', ...amountInActive.style }}
            textStyle={{ fontSize: 12, ...amountInActive.textStyle }}
          >
            {' '}
            {total_amount_in}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('amount_out')}
            style={{ width: '15%', alignItems: 'flex-end', ...amountOutActive.style }}
            textStyle={{ fontSize: 12, ...amountOutActive.textStyle }}
          >
            {' '}
            {total_amount_out}{' '}
          </Table.Link>
          <Table.Link
            onPress={() => this.handlefilterSumTotal('balance')}
            style={{ width: '15%', alignItems: 'flex-end', ...balanceActive.style }}
            textStyle={{ fontSize: 12, color: textColor, ...balanceActive.textStyle }}
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
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.topStyle}>
            <View style={{ width: '12%' }}>
              <Icon style={styles.dateIcon} name='calendar' size={35} color={GLOBALS.COLOR_MAIN} />
            </View>
            <View style={{ width: '40%' }}>
              <InputMonth selectedItems={this.state.stock_month} onSelectedItemsChange={this.onSelectedMonth.bind(this)} />
            </View>
            <View style={{ width: '48%', paddingLeft: 10 }}>
              <InputArea
                selectedItems={this.state.branchs_id}
                onSelectedItemsChange={this.onSelectedBranch.bind(this)}
                onSelectedItemObjectsChange={this.onSelectedItemObjectsChange.bind(this)}
              />
            </View>
          </View>
          <InputSearch placeholder={`${t('TEXT_SEARCH_PRODUCT_IN_BRANCH')}...`} onChangeText={(searchProduct) => this.setState({ searchProduct })} />
          <Table>
            <Table.Thead>
              <Table.TH style={{ width: '39%' }} textStyle={{ fontSize: 12 }}>
                <Icon name='copy' size={20} /> {t('TEXT_PRODUCT')}
              </Table.TH>
              <Table.TH style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }}>
                {t('TEXT_BRING')}
              </Table.TH>
              <Table.TH style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }}>
                {t('TEXT_RECEIVE')}
              </Table.TH>
              <Table.TH style={{ width: '16%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }}>
                {t('TEXT_PAYOFF')}
              </Table.TH>
              <Table.TH style={{ width: '15%', alignItems: 'flex-end' }} textStyle={{ fontSize: 11 }}>
                {t('TEXT_BALANCE')}
              </Table.TH>
            </Table.Thead>
            {this.renderStockCard()}
            {this.renderTotal()}
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

StockCard.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockCard))));

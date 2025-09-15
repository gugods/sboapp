// src/pages/StockPending/StockPending.js
import GLOBALS from '../../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createFilter } from 'react-native-search-filter';
import { findIndex, orderBy, split } from 'lodash';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { getFormatDate, getHeightScroll } from '../../libraries/Helper';
import { getStockPendingSearch } from '../../services/stockPendingService';
import { IconStatus, InputArea, InputDate, InputSearch, Table } from '../../components';
import { StackActions } from 'react-navigation';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../../libraries';

const KEYS_TO_FILTERS = ['stock_doc_no'];
const heightScroll = getHeightScroll() + 120;
const PENDING = 'PENDING';
const COMPLETED = 'COMPLETED';

class StockPending extends Component {
  constructor(props) {
    super(props);
    this.onLoad = false;
    this.state = {
      searchProduct: '',
      stockList: { loading: false, data: [] },
      branch_name: '',
      branchs_id: [],
      app_roles_id: 0,
      stock_date: moment().format('DD-MM-YYYY'),
      isDisabled: true,
      refreshing: false,
      nextPage: true,
      sorting: { orderBy: 'asc' },
    };
  }

  async componentDidMount() {
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

  onRefresh = async () => {
    this.setState({ refreshing: true });
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
    const results = await getStockPendingSearch(client, { branchs_id, stock_date });

    if (results.status) {
      stockList.data = results.data;
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }

    stockList.loading = false;
    this.setState({ stockList });
  }

  handleSorting(orderName) {
    const { sorting } = this.state;
    const orderBy = sorting.orderBy === 'desc' ? 'asc' : 'desc';
    this.setState({ sorting: { orderName, orderBy } });
  }

  // =================== set state value
  onSelectedBranch(ids_branchs) {
    this.setState({ branchs_id: ids_branchs, isDisabled: false }, async () => await this.getStockSearch());
  }

  onSelectedItemObjectsChange(ids_branchs) {
    this.setState({ branch_name: ids_branchs[0].name });
  }

  onSelectProductItem(value) {
    if (this.state.nextPage) {
      this.setState({ nextPage: false }, () => {
        const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
        const branch_name = split(this.state.branch_name, '(', 1)[0];
        const app_roles_id = this.state.app_roles_id;
        const pushAction = StackActions.push({
          routeName: 'StockPendingItem',
          params: {
            branchs_id,
            branch_name,
            stock_type: value.stock_type,
            stock_date: moment(value.stock_date).format('DD-MM-YYYY'),
            stock_doc_no: value.stock_doc_no,
            app_roles_id,
            onBackStockItem: ({ stock_doc_no, stock_type, stock_date, stock_status }) =>
              this.onBackStockItem({ stock_doc_no, stock_type, stock_date, stock_status }),
          },
        });
        this.props.navigation.dispatch(pushAction);
        setTimeout(() => {
          this.setState({ nextPage: true });
        }, 250);
      });
    }
  }

  onBackStockItem({ stock_doc_no, stock_type, stock_date, stock_status }) {
    const { stockList } = this.state;
    const stock_index = findIndex(stockList.data, { stock_doc_no, stock_type, stock_date });
    if (stock_index !== -1) {
      stockList.data[stock_index].stock_status = stock_status;
      this.setState({ stockList });
    }
  }

  // =================== set state value

  renderItem(value, index) {
    const { t } = this.props;
    let status;
    if (value.stock_status === COMPLETED) {
      status = true;
    } else if (value.stock_status === PENDING) {
      status = false;
    } else {
      status = null;
    }
    const stock_date = getFormatDate(moment(value.stock_date).format('DD-MM-YYYY'));
    return (
      <Table.Tbody key={index} rowColor={index}>
        <Table.TD style={{ width: '10%', alignItems: 'center' }}>{index + 1}</Table.TD>
        <Table.TD style={{ width: '15%', alignItems: 'center' }}>
          <IconStatus status={status} />
        </Table.TD>
        <Table.Link onPress={() => this.onSelectProductItem(value)} style={{ width: '25%' }} textStyle={{ fontSize: 12 }}>
          {value.stock_doc_no}
        </Table.Link>
        <Table.TD style={{ width: '25%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }}>
          {' '}
          {`${t(`TEXT_${value.stock_type}`)}`}{' '}
        </Table.TD>
        <Table.TD style={{ width: '25%', alignItems: 'center' }} textStyle={{ fontSize: 12 }}>
          {' '}
          {stock_date}{' '}
        </Table.TD>
      </Table.Tbody>
    );
  }

  renderStockPending() {
    const { t } = this.props;
    const { stockList, sorting } = this.state;
    if (stockList.loading) {
      return <Table.Loading />;
    }
    if (stockList.data.length > 0) {
      let filtereStore = stockList.data.filter(createFilter(this.state.searchProduct, KEYS_TO_FILTERS));
      if (sorting.orderName) {
        filtereStore = orderBy(filtereStore, [sorting.orderName], [sorting.orderBy]);
      }
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

  render() {
    const { t } = this.props;
    const { stock_date } = this.state;
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.topStyle}>
            <View style={{ width: '50%' }}>
              <InputDate date={stock_date} disabled={true} />
            </View>
            <View style={{ width: '50%' }}>
              <InputArea
                variables={{ stock_pending: 0 }}
                selectedItems={this.state.branchs_id}
                onSelectedItemsChange={this.onSelectedBranch.bind(this)}
                onSelectedItemObjectsChange={this.onSelectedItemObjectsChange.bind(this)}
              />
            </View>
          </View>
          <InputSearch placeholder={`${t('TEXT_SEARCH_STOCK_DOC_NO')}...`} onChangeText={(searchProduct) => this.setState({ searchProduct })} />
          <Table>
            <Table.Thead>
              <Table.TH style={{ width: '10%', alignItems: 'center' }}>#</Table.TH>
              <Table.TH style={{ width: '15%', alignItems: 'center' }} textStyle={{ fontSize: 12 }} numberOfLines={1}>
                {t('TEXT_STATUS')}
              </Table.TH>
              <Table.TH style={{ width: '25%', alignItems: 'flex-start' }} textStyle={{ fontSize: 12 }} numberOfLines={1}>
                {t('TEXT_DOC_NO')}
              </Table.TH>
              <Table.SORT
                style={{ width: '25%', alignItems: 'flex-start' }}
                textStyle={{ fontSize: 12 }}
                numberOfLines={1}
                onPress={() => this.handleSorting('stock_type')}
              >
                {t('TEXT_TYPE')}
              </Table.SORT>
              <Table.SORT
                style={{ width: '25%', alignItems: 'flex-start' }}
                textStyle={{ fontSize: 12 }}
                numberOfLines={1}
                onPress={() => this.handleSorting('stock_date')}
              >
                {t('TEXT_STOCK_DATE')}
              </Table.SORT>
            </Table.Thead>
            {this.renderStockPending()}
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

StockPending.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockPending))));

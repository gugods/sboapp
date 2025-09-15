// src/pages/StockProduct.js
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BtnQrcode, InputArea, InputProduct, Spinner, Table } from '../components';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { get, trim } from 'lodash';
import { getProductId } from '../services/employeeService';
import { getStockProductQrcode, getStockProductSearch } from '../services/stockProductService';
import { StackActions } from 'react-navigation';
import { WebView } from 'react-native-webview';
import { withApollo } from 'react-apollo';
import { withDialog, withUser } from '../libraries';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class StockProduct extends Component {
  constructor(props) {
    super(props);
    this.onLoad = false;
    this.state = {
      deviceWidth,
      deviceHeight,
      branchs_id: [],
      products_id: [],
      isDisabled: true,
      isLoading: false,
      sourceUrl: null,
      product_name: '',
      products: [],
      stock_date: moment().format('DD-MM-YYYY'),
    };
  }

  async componentDidMount() {
    const { users } = this.props.userStore;
    if (users.branchs_id && !this.onLoad) {
      this.onLoad = true;
      const branchs_id = [];
      branchs_id[0] = users.branchs_id;
      setTimeout(() => {
        this.setState({ branchs_id, isDisabled: false }, async () => await this.getStockProductSearch());
      }, 100);
    }
  }

  showScanLoading() {
    this.setState({ isLoading: true });
  }

  hideScanLoading() {
    this.setState({ isLoading: false });
  }

  onLayout = () => {
    const deviceHeight = Dimensions.get('window').height;
    const deviceWidth = Dimensions.get('window').width;
    this.setState({ deviceHeight, deviceWidth });
  };

  onLoadStart = () => {
    this.setState({ isLoading: true });
  };

  onLoadEnd = () => {
    this.setState({ isLoading: false });
  };

  // =================== set state value
  onSelectedBranch(ids_branchs) {
    this.setState({ branchs_id: ids_branchs, isDisabled: false }, async () => await this.getStockProductSearch());
  }

  onScanQrcode = () => {
    const pushAction = StackActions.push({
      routeName: 'Qrcode',
      params: { onBackQrcode: ({ qrcode }) => this.onBackQrcode({ qrcode }) },
    });
    this.props.navigation.dispatch(pushAction);
  };

  async onBackQrcode({ qrcode }) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    this.showScanLoading();
    const results = await getStockProductQrcode(client, { product_code: qrcode });
    if (results.status) {
      if (results.data.length > 0) {
        const product = results.data;
        const sourceUrl = trim(get(product, '[0].product_detail', ''));
        const product_name = get(product, '[0].product_desc', '');
        const products_id = [get(product, '[0].products_id', '')];
        if (sourceUrl !== '') {
          this.setState({ sourceUrl, products_id, product_name });
        } else {
          this.setState({ sourceUrl: null, products_id, product_name });
        }
      } else {
        dialogStore.showDialog({
          visible: true,
          format: 'CONFIRM_ERROR',
          title: t('ALERT_ERROR'),
          message: t('ALERT_ERROR_QRCODE'),
          handle: () => {
            this.onScanQrcode();
          },
        });
      }
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

  onSelectedItemObjectsChange(ids_products) {
    this.setState({ product_name: ids_products[0].name });
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

  async onSelectedProduct(ids_product) {
    const { t } = this.props;
    const { client, dialogStore } = this.props;
    const products_id = ids_product[0] ? ids_product[0] : 0;
    this.setState({ products_id: ids_product, isLoading: true });
    const results = await getProductId(client, { products_id });

    if (results.status) {
      const product = results.data;
      const sourceUrl = trim(get(product, '[0].product_detail', ''));
      if (sourceUrl !== '') {
        this.setState({ sourceUrl });
      } else {
        this.setState({ sourceUrl: null });
      }
    } else {
      dialogStore.showDialog({ visible: true, format: 'ERROR', title: t('ALERT_ERROR'), message: results.error });
    }

    this.setState({ isLoading: false });
  }

  async getStockProductSearch() {
    const { client } = this.props;
    const { stock_date } = this.state;
    const branchs_id = this.state.branchs_id[0] ? this.state.branchs_id[0] : 0;
    const results = await getStockProductSearch(client, { branchs_id, stock_date });
    if (results.status) {
      const products = [];
      results.data.map((value, index) => {
        const disabled = value.product_detail === '';
        products.push({ id: value.products_id, name: `${value.product_code} : ${value.product_name}`, disabled: disabled });
      });
      this.setState({ products });
    }
  }

  renderEmpty = () => {
    const { t } = this.props;
    const { sourceUrl, products_id, product_name } = this.state;
    if (products_id.length > 0 && !sourceUrl) {
      return (
        <React.Fragment>
          <Table.Full style={styles.productStyle} textStyle={{ fontWeight: '500', color: GLOBALS.COLOR_DESC }}>
            <Icon name='filing' size={18} /> {t('TEXT_PRODUCT')} {product_name}
          </Table.Full>
          <Table.Full style={styles.fullStyle} textStyle={{ fontWeight: '500' }}>
            <Icon name='ios-search' size={20} /> {t('ALERT_NODATA_PRODUCT')} {'\n'}{' '}
          </Table.Full>
        </React.Fragment>
      );
    } else if (products_id.length === 0) {
      return (
        <Table.Full style={styles.fullStyle} textStyle={{ fontWeight: '500' }}>
          <Icon name='ios-search' size={20} /> {t('ALERT_SELECT_PRODUCT')}
        </Table.Full>
      );
    } else {
      return (
        <Table.Full style={styles.productStyle} textStyle={{ fontWeight: '500', color: GLOBALS.COLOR_DESC }}>
          <Icon name='reader' size={20} /> {t('TEXT_PRODUCT')} {product_name}
        </Table.Full>
      );
    }
  };

  render() {
    const { t } = this.props;
    const { deviceWidth, deviceHeight, sourceUrl, isLoading, isDisabled, products } = this.state;

    const overlay = '<div class="imageOverlay" style="position: absolute;left: 0px;top: 0px;background: none;width: 100%;height: 100%;z-index: 998;"></div>';
    let customJS = '$("header,footer,.mylivechat_collapsed,.add-quantity").hide();';
    customJS += '$(".single-product-sharing,.product-nav").hide();';
    customJS += '$(".related-products-area,.breadcrumb-area").hide();';
    customJS += '$(".easyzoom").removeClass("easyzoom easyzoom--overlay is-ready");';
    customJS += `$(".product-details-images").append('${overlay}');`;
    customJS += '$(".imageOverlay").click(function() { $(".popup-img").trigger("click"); });';

    return (
      <React.Fragment>
        <View style={styles.topContainer}>
          <View style={styles.topStyle}>
            <View style={{ width: '45%', paddingRight: 10 }}>
              <InputArea selectedItems={this.state.branchs_id} onSelectedItemsChange={this.onSelectedBranch.bind(this)} />
            </View>
            <View style={{ width: '55%' }}>
              <InputProduct
                products={products}
                disabled={isDisabled}
                onPress={this.onInputProduct.bind(this)}
                selectedItems={this.state.products_id}
                onSelectedItemsChange={this.onSelectedProduct.bind(this)}
                onSelectedItemObjectsChange={this.onSelectedItemObjectsChange.bind(this)}
                renderSelectText={() => t('TEXT_SEARCH_PRODUCT_IN_BRANCH')}
                checkValue='product_detail'
              />
            </View>
          </View>
          <View style={styles.bottomStyle}>
            <View style={{ width: '80%', paddingRight: 10 }}>
              <InputProduct
                selectedItems={this.state.products_id}
                onSelectedItemsChange={this.onSelectedProduct.bind(this)}
                onSelectedItemObjectsChange={this.onSelectedItemObjectsChange.bind(this)}
                checkValue='product_detail'
              />
            </View>
            <BtnQrcode style={{ top: -7 }} onPress={this.onScanQrcode.bind()} />
          </View>
          <Table>{this.renderEmpty()}</Table>
        </View>
        {isLoading && <Spinner />}
        <View style={styles.container} onLayout={this.onLayout}>
          {sourceUrl && (
            <WebView
              onLoadStart={this.onLoadStart}
              onLoadEnd={this.onLoadEnd}
              ref={(WEBVIEW_REF) => (this.WebViewRef = WEBVIEW_REF)}
              style={[styles.WebView, { width: deviceWidth, height: deviceHeight }]}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={customJS}
              source={{ uri: sourceUrl }}
            />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    padding: 15,
    paddingTop: 15,
  },
  WebView: {
    flex: 1,
    marginBottom: 0,
  },
  topStyle: {
    flexDirection: 'row',
    marginBottom: 5,
    position: 'relative',
  },
  bottomStyle: {
    flexDirection: 'row',
    marginBottom: 5,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: GLOBALS.COLOR_LINE,
  },
  fullStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_MAIN,
  },
  productStyle: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: GLOBALS.COLOR_LINE,
    paddingBottom: 15,
  },
});

StockProduct.propTypes = {
  client: PropTypes.object,
  userStore: PropTypes.object,
  dialogStore: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default withApollo(withUser(withDialog(withTranslation()(StockProduct))));

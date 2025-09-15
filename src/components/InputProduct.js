// src/components/Product.js
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { GET_PRODUCTS, GET_PRODUCT_DETAIL } from '../services/graphql';
import { getList } from '../libraries/Array';
import { Query } from 'react-apollo';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class InputProduct extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    const { selectedItems, onSelectedItemsChange, onSelectedItemObjectsChange, disabled, onPress, selectText, products, variables, checkValue } = this.props;
    let renderSelectText = this.props.renderSelectText;
    let GET_PRODUCTS_GRAPHQL = checkValue ? GET_PRODUCT_DETAIL : GET_PRODUCTS;
    return (
      <TouchableOpacity onPress={onPress}>
        {products ? (
          <SectionedMultiSelect
            disabled={disabled}
            ref={(ref) => (this.productSelect = ref)}
            items={products}
            uniqueKey='id'
            selectText={selectText ? selectText : t('TEXT_SEARCH_PRODUCT_ALL') + '...'}
            renderSelectText={renderSelectText}
            showDropDowns={true}
            single={true}
            onSelectedItemsChange={onSelectedItemsChange}
            onSelectedItemObjectsChange={onSelectedItemObjectsChange}
            selectedItems={selectedItems}
            hideConfirm={false}
            confirmText={t('BUTTON_CLOSE')}
            searchPlaceholderText={t('TEXT_SEARCH_PRODUCT_ALL') + '...'}
            styles={selectStyle}
            colors={selectColor}
            showChips={false}
            IconRenderer={Icon}
            icons={GLOBALS.ICONS}
          />
        ) : (
          <Query query={GET_PRODUCTS_GRAPHQL} variables={{ ...variables, random: Math.random() }}>
            {({ loading, error, data }) => {
              let products = [];
              if (data && data.getProducts) {
                products = getList({ list: data.getProducts.data, id: 'products_id', name: 'product_desc', checkValue });
              }
              if (renderSelectText === undefined) renderSelectText = () => t('TEXT_SEARCH_PRODUCT_ALL') + '...';
              return (
                <SectionedMultiSelect
                  disabled={disabled}
                  ref={(ref) => (this.productSelect = ref)}
                  items={products}
                  uniqueKey='id'
                  selectText={selectText ? selectText : t('TEXT_SEARCH_PRODUCT_ALL') + '...'}
                  renderSelectText={renderSelectText}
                  showDropDowns={true}
                  single={true}
                  onSelectedItemsChange={onSelectedItemsChange}
                  onSelectedItemObjectsChange={onSelectedItemObjectsChange}
                  selectedItems={selectedItems}
                  hideConfirm={false}
                  confirmText={t('BUTTON_CLOSE')}
                  searchPlaceholderText={t('TEXT_SEARCH_PRODUCT_ALL') + '...'}
                  styles={selectStyle}
                  colors={selectColor}
                  showChips={false}
                  IconRenderer={Icon}
                  icons={GLOBALS.ICONS}
                />
              );
            }}
          </Query>
        )}
      </TouchableOpacity>
    );
  }
}

const selectStyle = {
  selectToggle: {
    backgroundColor: GLOBALS.COLOR_GRAY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR_MAIN,
    borderWidth: 1,
    marginBottom: 10,
  },
  selectToggleText: {
    fontSize: 14,
    color: GLOBALS.COLOR_MAIN,
  },
  button: {
    backgroundColor: GLOBALS.COLOR_MAIN,
  },
  confirmText: {
    fontWeight: '100',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '100',
    paddingVertical: 5,
    // color: GLOBALS.COLOR_DESC
  },
};

const selectColor = {
  success: GLOBALS.COLOR_MAIN,
  text: GLOBALS.COLOR_DESC,
  disabled: GLOBALS.COLOR_CANCEL,
};

InputProduct.propTypes = {
  selectedItems: PropTypes.array,
  onSelectedItemsChange: PropTypes.func.isRequired,
  onSelectedItemObjectsChange: PropTypes.func,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  renderSelectText: PropTypes.func,
  selectText: PropTypes.string,
  products: PropTypes.any,
  checkValue: PropTypes.string,
};

export default withTranslation()(InputProduct);

import I18n from '../i18n';
import {
  CREATE_STOCK_COUNT,
  DELETE_STOCK_COUNT,
  GET_STOCK_COUNT_PRODUCT,
  GET_STOCK_COUNT_QRCODE,
  GET_STOCK_COUNT_SEARCH,
  GET_STOCK_ITEM_COUNT,
} from './graphql';

export const getStockCountSearch = async (client, { branchs_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_COUNT_SEARCH,
      variables: {
        branchs_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockCountSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockCountProduct = async (client, { branchs_id, products_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_COUNT_PRODUCT,
      variables: {
        branchs_id,
        products_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockCountProduct)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockCountQrcode = async (client, { branchs_id, qrcode, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_COUNT_QRCODE,
      variables: {
        branchs_id,
        qrcode,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockCountQrcode)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const createStockCount = async (client, { branchs_id, products_id, products }) => {
  const result = await client
    .mutate({
      mutation: CREATE_STOCK_COUNT,
      variables: {
        branchs_id,
        products_id,
        products,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.createStockCount)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockItemCount = async (client, { branchs_id, products_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_ITEM_COUNT,
      variables: {
        branchs_id,
        products_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockItemCount)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const deleteStockCount = async (client, { branchs_id, stock_count_id, item_index }) => {
  const result = await client
    .mutate({
      mutation: DELETE_STOCK_COUNT,
      variables: {
        branchs_id,
        stock_count_id,
        item_index,
      },
    })
    .then(async (res) => res.data.deleteStockCount)
    .catch((err) => ({ status: false, error: err }));
  return result;
};

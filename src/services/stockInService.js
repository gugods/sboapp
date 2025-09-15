import I18n from '../i18n';
import { CREATE_STOCK_IN, GET_STOCK_IN_PRODUCT, GET_STOCK_IN_QRCODE, GET_STOCK_IN_SEARCH } from './graphql';

export const getStockInSearch = async (client, { branchs_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_IN_SEARCH,
      variables: {
        branchs_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockInSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockInProduct = async (client, { branchs_id, products_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_IN_PRODUCT,
      variables: {
        branchs_id,
        products_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockInProduct)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockInQrcode = async (client, { branchs_id, qrcode, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_IN_QRCODE,
      variables: {
        branchs_id,
        qrcode,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockInQrcode)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const createStockIn = async (client, { branchs_id, products_id, products, file }) => {
  const result = await client
    .mutate({
      mutation: CREATE_STOCK_IN,
      variables: {
        branchs_id,
        products_id,
        products,
        file,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.createStockIn)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

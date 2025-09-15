import I18n from '../i18n';
import { CREATE_STOCK_OUT, GET_STOCK_OUT_PRODUCT, GET_STOCK_OUT_QRCODE, GET_STOCK_OUT_SEARCH } from './graphql';

export const getStockOutSearch = async (client, { branchs_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_OUT_SEARCH,
      variables: {
        branchs_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockOutSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockOutProduct = async (client, { branchs_id, products_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_OUT_PRODUCT,
      variables: {
        branchs_id,
        products_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockOutProduct)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockOutQrcode = async (client, { branchs_id, qrcode, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_OUT_QRCODE,
      variables: {
        branchs_id,
        qrcode,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockOutQrcode)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const createStockOut = async (client, { branchs_id, products_id, products, file }) => {
  const result = await client
    .mutate({
      mutation: CREATE_STOCK_OUT,
      variables: {
        branchs_id,
        products_id,
        products,
        file,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.createStockOut)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

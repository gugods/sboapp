import I18n from '../i18n';
import { GET_STOCK_PRODUCT_QRCODE, GET_STOCK_PRODUCT_SEARCH } from './graphql';

export const getStockProductSearch = async (client, { branchs_id, stock_date }) => {
  const result = await client
    .query({
      query: GET_STOCK_PRODUCT_SEARCH,
      variables: {
        branchs_id,
        stock_date,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockProductSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockProductQrcode = async (client, { product_code }) => {
  const result = await client
    .query({
      query: GET_STOCK_PRODUCT_QRCODE,
      variables: {
        product_code,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getProducts)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

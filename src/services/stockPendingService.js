import I18n from '../i18n';
import { CREATE_STOCK_PENDING, GET_STOCK_PENDING_PRODUCT, GET_STOCK_PENDING_SEARCH } from './graphql';

export const getStockPendingSearch = async (client, { branchs_id }) => {
  const result = await client
    .query({
      query: GET_STOCK_PENDING_SEARCH,
      variables: {
        branchs_id,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockPendingSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockPendingProduct = async (client, { branchs_id, stock_doc_no, stock_date, stock_type }) => {
  const result = await client
    .query({
      query: GET_STOCK_PENDING_PRODUCT,
      variables: {
        branchs_id,
        stock_doc_no,
        stock_date,
        stock_type,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockPendingProduct)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const createStockPending = async (client, { branchs_id, products }) => {
  const result = await client
    .mutate({
      mutation: CREATE_STOCK_PENDING,
      variables: {
        branchs_id,
        products,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.createStockPending)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

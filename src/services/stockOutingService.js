import I18n from '../i18n';
import { CREATE_STOCK_OUTING, GET_STOCK_OUTING_PRODUCT, GET_STOCK_OUTING_SEARCH } from './graphql';

export const getStockOutingSearch = async (client, { branchs_id }) => {
  const result = await client
    .query({
      query: GET_STOCK_OUTING_SEARCH,
      variables: {
        branchs_id,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockOutingSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockOutingProduct = async (client, { branchs_id, stock_doc_no, stock_date, stock_type }) => {
  const result = await client
    .query({
      query: GET_STOCK_OUTING_PRODUCT,
      variables: {
        branchs_id,
        stock_doc_no,
        stock_date,
        stock_type,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockOutingProduct)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const createStockOuting = async (client, { branchs_id, products }) => {
  const result = await client
    .mutate({
      mutation: CREATE_STOCK_OUTING,
      variables: {
        branchs_id,
        products,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.createStockOuting)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

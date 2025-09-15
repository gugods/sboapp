import I18n from '../i18n';
import { DELETE_STOCK_CARD, GET_STOCK_CARD_SEARCH, GET_STOCK_ITEM_SEARCH } from './graphql';

export const getStockCardSearch = async (client, { branchs_id, stock_month }) => {
  const result = await client
    .query({
      query: GET_STOCK_CARD_SEARCH,
      variables: {
        branchs_id,
        stock_month,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockCardSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getStockItemSearch = async (client, { branchs_id, products_id, stock_inout, stock_month }) => {
  const result = await client
    .query({
      query: GET_STOCK_ITEM_SEARCH,
      variables: {
        branchs_id,
        products_id,
        stock_inout,
        stock_month,
        random: Math.random(),
      },
    })
    .then(async (res) => res.data.getStockItemSearch)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const deleteStockCard = async (client, { branchs_id, stock_show_id }) => {
  const result = await client
    .mutate({
      mutation: DELETE_STOCK_CARD,
      variables: {
        branchs_id,
        stock_show_id,
      },
    })
    .then(async (res) => res.data.deleteStockCard)
    .catch((err) => ({ status: false, error: err }));
  return result;
};

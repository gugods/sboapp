// ./libraries/graphql/stockCard/get_stock_card_search.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_CARD_SEARCH = gql`
  query GET_STOCK_CARD_SEARCH($branchs_id: Int!, $stock_month: String!) {
    getStockCardSearch(branchs_id: $branchs_id, stock_month: $stock_month) {
      data {
        products_id
        product_name
        product_code
        stock_amount
        stock_amount_in
        stock_amount_out
      }
      status
      error
    }
  }
`;

export default GET_STOCK_CARD_SEARCH;

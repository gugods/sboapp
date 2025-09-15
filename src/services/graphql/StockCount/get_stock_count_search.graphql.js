// ./libraries/graphql/get_stock_count_search.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_COUNT_SEARCH = gql`
  query GET_STOCK_COUNT_SEARCH($branchs_id: Int!, $stock_date: String!) {
    getStockCountSearch(branchs_id: $branchs_id, stock_date: $stock_date) {
      data {
        products_id
        product_name
        product_code
        stock_amount
        stock_counter
      }
      status
      error
    }
  }
`;

export default GET_STOCK_COUNT_SEARCH;

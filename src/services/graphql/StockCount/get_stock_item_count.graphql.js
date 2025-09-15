// ./libraries/graphql/stockCard/get_stock_item_count.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_ITEM_COUNT = gql`
  query GET_STOCK_ITEM_COUNT($branchs_id: Int!, $products_id: Int!, $stock_date: String!) {
    getStockItemCount(branchs_id: $branchs_id, products_id: $products_id, stock_date: $stock_date) {
      data {
        stock_count_id
        item_index
        fullname
        products_id
        stock_method
        stock_date
        stock_time
      }
      status
      error
    }
  }
`;

export default GET_STOCK_ITEM_COUNT;

// ./libraries/graphql/stockCard/delete_stock_count.graphql.js
import gql from 'graphql-tag';

const DELETE_STOCK_COUNT = gql`
  mutation DELETE_STOCK_COUNT($branchs_id: Int!, $stock_count_id: Int!, $item_index: Int!) {
    deleteStockCount(branchs_id: $branchs_id, stock_count_id: $stock_count_id, item_index: $item_index) {
      status
      error
    }
  }
`;

export default DELETE_STOCK_COUNT;

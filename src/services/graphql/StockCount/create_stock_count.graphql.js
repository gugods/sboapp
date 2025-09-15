// ./libraries/graphql/create_stock_count.graphql.js
import gql from 'graphql-tag';

const CREATE_STOCK_COUNT = gql`
  mutation CREATE_STOCK_COUNT($branchs_id: Int!, $products_id: Int, $products: [inputStockCount]) {
    createStockCount(branchs_id: $branchs_id, products_id: $products_id, products: $products) {
      status
      error
      data {
        products_id
        product_code
        product_name
        stock_amount
        stock_counter
      }
    }
  }
`;

export default CREATE_STOCK_COUNT;

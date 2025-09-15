// ./libraries/graphql/create_stock_out.graphql.js
import gql from 'graphql-tag';

const CREATE_STOCK_OUT = gql`
  mutation CREATE_STOCK_OUT($branchs_id: Int!, $products_id: Int, $products: [inputStockOut]) {
    createStockOut(branchs_id: $branchs_id, products_id: $products_id, products: $products) {
      status
      error
      data {
        products_id
        product_code
        product_name
        stock_amount
      }
    }
  }
`;

export default CREATE_STOCK_OUT;

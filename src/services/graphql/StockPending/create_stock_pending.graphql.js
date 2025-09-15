// ./libraries/graphql/create_stock_pending.graphql.js
import gql from 'graphql-tag';

const CREATE_STOCK_PENDING = gql`
  mutation CREATE_STOCK_PENDING($branchs_id: Int!, $products: [inputStockPending]) {
    createStockPending(branchs_id: $branchs_id, products: $products) {
      status
      error
      data {
        stock_pending_id
        products_id
        product_code
        product_name
        stock_amount
        stock_doc_no
        stock_type
        stock_date
        confirm_date
        stock_status
      }
    }
  }
`;

export default CREATE_STOCK_PENDING;

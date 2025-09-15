// ./libraries/graphql/create_stock_outing.graphql.js
import gql from 'graphql-tag';

const CREATE_STOCK_OUTING = gql`
  mutation CREATE_STOCK_OUTING($branchs_id: Int!, $products: [inputStockOuting]) {
    createStockOuting(branchs_id: $branchs_id, products: $products) {
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

export default CREATE_STOCK_OUTING;

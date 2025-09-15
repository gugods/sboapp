// ./libraries/graphql/get_stock_outing_product.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_OUTING_PRODUCT = gql`
  query GET_STOCK_OUTING_PRODUCT($branchs_id: Int!, $stock_doc_no: String!, $stock_type: String!, $stock_date: String!) {
    getStockOutingProduct(branchs_id: $branchs_id, stock_doc_no: $stock_doc_no, stock_type: $stock_type, stock_date: $stock_date) {
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
      status
      error
    }
  }
`;

export default GET_STOCK_OUTING_PRODUCT;

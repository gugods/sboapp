// ./libraries/graphql/get_stock_out_product.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_OUT_PRODUCT = gql`
  query GET_STOCK_OUT_PRODUCT($branchs_id: Int!, $products_id: Int!, $stock_date: String!) {
    getStockOutProduct(branchs_id: $branchs_id, products_id: $products_id, stock_date: $stock_date) {
      data {
        products_id
        product_name
        product_code
        stock_amount
      }
      status
      error
    }
  }
`;

export default GET_STOCK_OUT_PRODUCT;

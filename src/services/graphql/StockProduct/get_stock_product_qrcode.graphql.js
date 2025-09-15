// ./libraries/graphql/get_stock_in_qrcode.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_PRODUCT_QRCODE = gql`
  query GET_STOCK_PRODUCT_QRCODE($product_code: String) {
    getProducts(filter: { product_code: $product_code }) {
      data {
        products_id
        product_code
        product_name
        product_desc
        product_detail
      }
      status
      error
    }
  }
`;

export default GET_STOCK_PRODUCT_QRCODE;

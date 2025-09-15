// ./libraries/graphql/get_stock_count_qrcode.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_COUNT_QRCODE = gql`
  query GET_STOCK_COUNT_QRCODE($branchs_id: Int!, $qrcode: String!, $stock_date: String!) {
    getStockCountQrcode(branchs_id: $branchs_id, qrcode: $qrcode, stock_date: $stock_date) {
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

export default GET_STOCK_COUNT_QRCODE;

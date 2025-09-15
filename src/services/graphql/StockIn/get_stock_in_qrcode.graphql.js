// ./libraries/graphql/get_stock_in_qrcode.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_IN_QRCODE = gql`
  query GET_STOCK_IN_QRCODE($branchs_id: Int!, $qrcode: String!, $stock_date: String!) {
    getStockInQrcode(branchs_id: $branchs_id, qrcode: $qrcode, stock_date: $stock_date) {
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

export default GET_STOCK_IN_QRCODE;

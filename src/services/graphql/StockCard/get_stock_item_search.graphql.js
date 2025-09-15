// ./libraries/graphql/stockCard/get_stock_item_search.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_ITEM_SEARCH = gql`
  query GET_STOCK_ITEM_SEARCH($branchs_id: Int!, $products_id: Int!, $stock_month: String!, $stock_inout: String!) {
    getStockItemSearch(branchs_id: $branchs_id, products_id: $products_id, stock_month: $stock_month, stock_inout: $stock_inout) {
      data {
        stock_show_id
        fullname
        products_id
        serial_no
        stock_type
        stock_inout
        stock_method
        stock_remark
        stock_date
        stock_doc_no
        stock_doc_file
        stock_status
      }
      status
      error
    }
  }
`;

export default GET_STOCK_ITEM_SEARCH;

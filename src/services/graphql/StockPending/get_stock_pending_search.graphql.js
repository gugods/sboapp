// ./libraries/graphql/get_stock_pending_search.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_PENDING_SEARCH = gql`
  query GET_STOCK_PENDING_SEARCH($branchs_id: Int!) {
    getStockPendingSearch(branchs_id: $branchs_id) {
      data {
        stock_date
        stock_type
        stock_doc_no
        stock_status
      }
      status
      error
    }
  }
`;

export default GET_STOCK_PENDING_SEARCH;

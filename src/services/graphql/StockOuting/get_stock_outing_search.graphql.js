// ./libraries/graphql/get_stock_outing_search.graphql.js
import gql from 'graphql-tag';

const GET_STOCK_OUTING_SEARCH = gql`
  query GET_STOCK_OUTING_SEARCH($branchs_id: Int!) {
    getStockOutingSearch(branchs_id: $branchs_id) {
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

export default GET_STOCK_OUTING_SEARCH;

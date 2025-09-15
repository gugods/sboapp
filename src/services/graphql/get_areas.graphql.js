// ./libraries/graphql/get_areas.graphql.js
import gql from 'graphql-tag';

const GET_AREAS = gql`
  query GET_AREAS($stock_pending: Int, $stock_outing: Int) {
    getAreas(filter: { stock_pending: $stock_pending, stock_outing: $stock_outing }) {
      data {
        branchs_id
        branch_code
        branch_name
      }
      status
      error
    }
  }
`;

export default GET_AREAS;

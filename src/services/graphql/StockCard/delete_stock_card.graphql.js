// ./libraries/graphql/stockCard/delete_stock_card.graphql.js
import gql from 'graphql-tag';

const DELETE_STOCK_CARD = gql`
  mutation DELETE_STOCK_CARD($branchs_id: Int!, $stock_show_id: Int!) {
    deleteStockCard(branchs_id: $branchs_id, stock_show_id: $stock_show_id) {
      status
      error
    }
  }
`;

export default DELETE_STOCK_CARD;

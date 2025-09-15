// ./libraries/graphql/get_products.graphql.js
import gql from 'graphql-tag';

const GET_PRODUCTS = gql`
  query GET_PRODUCTS {
    getProducts {
      data {
        products_id
        product_desc
      }
      status
      error
    }
  }
`;

export default GET_PRODUCTS;

export const GET_PRODUCT_DETAIL = gql`
  query GET_PRODUCTS {
    getProducts {
      data {
        products_id
        product_desc
        product_detail
      }
      status
      error
    }
  }
`;

export const GET_PRODUCT_ID = gql`
  query GET_PRODUCTS_ID($products_id: Int) {
    getProducts(filter: { products_id: $products_id }) {
      data {
        products_id
        product_detail
      }
      status
      error
    }
  }
`;

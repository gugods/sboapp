// ./libraries/graphql/get_modules.graphql.js
import gql from 'graphql-tag';

const GET_MODULES = gql`
  query GET_MODULES {
    getModules {
      data {
        module
        badge_number
        url
        submenu {
          module
          badge_number
          url
        }
      }
      status
      error
    }
  }
`;

export default GET_MODULES;

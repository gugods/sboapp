// ./libraries/graphql/logout_employee.graphql.js
import gql from 'graphql-tag';

const LOGOUT_EMPLOYEE = gql`
  mutation LOGOUT_EMPLOYEE {
    logoutEmployee {
      status
      error
    }
  }
`;

export default LOGOUT_EMPLOYEE;

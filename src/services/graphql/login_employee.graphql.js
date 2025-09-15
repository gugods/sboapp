// ./libraries/graphql/login_employee.graphql.js
import gql from 'graphql-tag';

const LOGIN_EMPLOYEE = gql`
  mutation LOGIN_EMPLOYEE($username: String!, $password: String!) {
    loginEmployee(username: $username, password: $password) {
      data {
        employees_id
        fullname
        phone
        username
        image
        section_name
        sections_id
        app_roles_id
        roles_name
        roles_branch
        branchs_id
        branch_name
        store_name
        access_token
        area_name
        areas {
          branchs_id
          branch_name
          store_name
        }
        employees {
          employees_id
          branch_name
          fullname
        }
      }
      status
      error
    }
  }
`;

export default LOGIN_EMPLOYEE;

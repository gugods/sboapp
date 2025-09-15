// ./libraries/graphql/get_employee.graphql.js
import gql from 'graphql-tag';

const GET_EMPLOYEE = gql`
  query GET_EMPLOYEE {
    getEmployee {
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

export default GET_EMPLOYEE;

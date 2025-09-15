// ./libraries/graphql/send_contact.graphql.js
import gql from 'graphql-tag';

const SEND_CONTACT = gql`
  mutation SEND_CONTACT($subject: String!, $message: String!) {
    sendContact(subject: $subject, message: $message) {
      status
      error
    }
  }
`;

export default SEND_CONTACT;

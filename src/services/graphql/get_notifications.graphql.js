// ./libraries/graphql/get_notifications.graphql.js
import gql from 'graphql-tag';

const GET_NOTIFICATIONS = gql`
  query GET_NOTIFICATIONS {
    getNotifications {
      data {
        notifications_id
        title
        message
        date
      }
      status
      error
    }
  }
`;

export default GET_NOTIFICATIONS;

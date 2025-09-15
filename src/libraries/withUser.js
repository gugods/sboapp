import React from 'react';
import { UserConsumer } from './StoreContext';

const getComponentDisplayName = (Component) => Component.displayName || Component.name || 'Unknown';

export default (ComposedComponent) =>
  class withUser extends React.Component {

    static displayName = `withUser(${getComponentDisplayName(ComposedComponent)})`;

    constructor(props) {
      super(props);
      this.state = { userStore: null };
    } 

    render() {
      return (
        <UserConsumer>
          {(store) =>  <ComposedComponent userStore={store} {...this.props} />}
        </UserConsumer>
      );
      
    }
  };

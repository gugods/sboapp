import React from 'react';
import { DialogConsumer } from './StoreContext';

const getComponentDisplayName = (Component) => Component.displayName || Component.name || 'Unknown';

export default (ComposedComponent) =>
  class withDialog extends React.Component {

    static displayName = `withDialog(${getComponentDisplayName(ComposedComponent)})`;

    constructor(props) {
      super(props);
      this.state = { dialogStore: null };
    } 

    render() {
      return (
        <DialogConsumer>
          {(store) =>  <ComposedComponent dialogStore={store} {...this.props} />}
        </DialogConsumer>
      );
      
    }
  };

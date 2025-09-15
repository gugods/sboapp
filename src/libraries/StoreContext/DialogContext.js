// src/libraries/StoreContext/DialogContext.js
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext();

const DialogProvider = ({ children }) => {
  const [{ visible, format, title, message, handle }, showDialog] = useState(
    { visible: false },
    { format: '' },
    { title: '' },
    { message: '' },
    { handle: () => {} }
  );
  const store = {
    visible,
    format,
    title,
    message,
    handle,
    showDialog: ({ visible, format, title, message, handle }) => showDialog({ visible, format, title, message, handle }),
  };
  return <DialogContext.Provider value={store}>{children}</DialogContext.Provider>;
};

const DialogConsumer = ({ children }) => <DialogContext.Consumer>{children}</DialogContext.Consumer>;

DialogProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

DialogConsumer.propTypes = {
  children: PropTypes.func,
};

export { DialogProvider, DialogConsumer, DialogContext };
export const useDialogContext = () => useContext(DialogContext);

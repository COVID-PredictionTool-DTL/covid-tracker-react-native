import React, { ReactNode, useCallback, useState } from 'react';

import { IUIMessage } from './types';

interface IMessageContext {
  message: IUIMessage | null;
  addMessage: (msg: IUIMessage) => void;
  removeMessage: () => void;
}

export const MessageContext = React.createContext<IMessageContext>({
  addMessage: () => {},
  message: null,
  removeMessage: () => {},
});

interface IProps {
  children: ReactNode;
}

function MessageProvider({ children }: IProps) {
  const [message, setMessage] = useState<IUIMessage | null>(null);
  const removeMessage = () => setMessage(null);
  const addMessage = (message: IUIMessage) => setMessage(message);

  const contextValue: IMessageContext = {
    addMessage: useCallback((message) => addMessage(message), []),
    message,
    removeMessage: useCallback(() => removeMessage(), []),
  };

  return <MessageContext.Provider value={contextValue}>{children}</MessageContext.Provider>;
}

export default MessageProvider;

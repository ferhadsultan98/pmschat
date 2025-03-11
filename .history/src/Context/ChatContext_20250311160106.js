import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <ChatContext.Provider value={{ selectedContact, setSelectedContact }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
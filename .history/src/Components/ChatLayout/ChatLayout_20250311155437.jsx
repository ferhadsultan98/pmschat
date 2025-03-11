import React from "react";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";


const ChatLayout = () => {
  return (
    <div className="chatLayout">
      <ContactsList />
      <ChatWindow />
      <ContactsModal />
    </div>
  );
};

export default ChatLayout;
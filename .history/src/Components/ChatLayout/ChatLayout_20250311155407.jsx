import React from "react";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";
import ContactsModal from "../ChatPerson/Contacts/ContactsModal";

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
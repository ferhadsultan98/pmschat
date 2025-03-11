import React, { useState } from "react";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="chatLayout">
      <ContactsList onContactSelect={handleContactSelect} />
      <ChatWindow contact={selectedContact} />
    </div>
  );
};

export default ChatLayout;
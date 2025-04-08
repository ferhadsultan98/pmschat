import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isContactsOpen, setIsContactsOpen] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (!authData || !authData.token) {
      navigate("/login");
    } else {
      setCurrentUser(authData);
    }
  }, [navigate]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsContactsOpen(false);
  };

  const handleToggleChat = () => {
    setIsContactsOpen(true); 
    setSelectedContact(null); 
  };

  if (!currentUser) return null; 

  return (
    <div className="chatLayout">
      <ContactsList
        onContactSelect={handleContactSelect}
        currentUser={currentUser}
        isOpen={isContactsOpen}
      />
      {selectedContact && (
        <ChatWindow
          contact={selectedContact}
          currentUser={currentUser}
          isOpen={!isContactsOpen} 
          toggleWindow={handleToggleChat} 
        />
      )}
    </div>
  );
};

export default ChatLayout;
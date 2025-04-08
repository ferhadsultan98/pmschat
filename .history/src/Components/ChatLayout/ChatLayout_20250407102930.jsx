import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isContactsOpen, setIsContactsOpen] = useState(true); // ContactsList visible by default
  const navigate = useNavigate();

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (!authData || !authData.token) {
      navigate("/login");
    } else {
      setCurrentUser(authData); // Set logged-in user from localStorage
    }
  }, [navigate]);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setIsContactsOpen(false); // Hide ContactsList and show ChatWindow
  };

  const handleToggleChat = () => {
    setIsContactsOpen(true); // Show ContactsList and hide ChatWindow
    setSelectedContact(null); // Reset selected contact
  };

  if (!currentUser) return null; // Wait until user data is loaded

  return (
    <div className="chatLayout">
      <ContactsList
        onContactSelect={handleContactSelect}
        currentUser={currentUser}
        isOpen={isContactsOpen}
        toggleContacts={() => setIsContactsOpen(!isContactsOpen)}
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
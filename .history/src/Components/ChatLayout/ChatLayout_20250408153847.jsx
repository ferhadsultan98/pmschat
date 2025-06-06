import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // Yeni durum
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
    setIsChatOpen(true);
  };

  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen); 
  };

  if (!currentUser) return null;

  return (
    <div className="chatLayout">
      <ContactsList
        onContactSelect={handleContactSelect}
        currentUser={currentUser}
        isOpen={!isChatOpen} 
      />
      {selectedContact && (
        <ChatWindow
          contact={selectedContact}
          currentUser={currentUser}
          isOpen={isChatOpen}
          toggleWindow={toggleChatWindow}
        />
      )}
    </div>
  );
};

export default ChatLayout;
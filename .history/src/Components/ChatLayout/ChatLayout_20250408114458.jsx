import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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
  };

  if (!currentUser) return null; // Wait until user data is loaded

  return (
    <div className="chatLayout">
      <ContactsList
        onContactSelect={handleContactSelect}
        currentUser={currentUser}
      />
      <ChatWindow contact={selectedContact} currentUser={currentUser} />
    </div>
  );
};

export default ChatLayout;
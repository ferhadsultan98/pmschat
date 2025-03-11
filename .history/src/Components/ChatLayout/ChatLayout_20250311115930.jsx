import React, { useState } from "react";
import "./ChatLayout.scss";
import ContactsList from "../ChatPerson/ContactsList";
import ChatWindow from "../ChatWindow/ChatWindow";
import FileModal from "../ChatWindow/ChatFileModal/FileModal";
import ContactsModal from "../ChatPerson/Contacts/ContactsModal";
import { logout } from "../../Utils/auth"; 
import { useNavigate } from "react-router-dom"; 
import { getCurrentUser } from "../../utils/auth"; 

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const currentUser = getCurrentUser(); 

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleAddButtonClick = () => {
    setShowContactsModal(true);
  };

  const handleFileButtonClick = () => {
    setShowFileModal(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLogout = () => {
    logout(); // Clear session storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="chatLayout">
      <div className="chatHeader">
        <div className="userInfo">
          {currentUser && (
            <span>Welcome, {currentUser.fullName || currentUser.username}</span>
          )}
        </div>
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <ContactsList
        selectedContact={selectedContact}
        onContactSelect={handleContactSelect}
        onAddButtonClick={handleAddButtonClick}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      
      {selectedContact && (
        <ChatWindow
          contact={selectedContact}
          onFileButtonClick={handleFileButtonClick}
        />
      )}
      
      {showFileModal && <FileModal onClose={() => setShowFileModal(false)} />}
      
      {showContactsModal && (
        <ContactsModal
          onClose={() => setShowContactsModal(false)}
          onContactSelect={(contact) => {
            handleContactSelect(contact);
            setShowContactsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatLayout;
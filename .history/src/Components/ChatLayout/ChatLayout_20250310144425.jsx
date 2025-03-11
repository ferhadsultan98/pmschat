import React, { useState } from 'react';
import ContactsList from '../ContactsList/ContactsList';
import ChatWindow from '../ChatWindow/ChatWindow';
import FileModal from '../FileModal/FileModal';
import ContactsModal from '../ContactsModal/ContactsModal';
import './ChatLayout.scss';

const ChatLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="chatLayout">
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
      {showFileModal && (
        <FileModal onClose={() => setShowFileModal(false)} />
      )}
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
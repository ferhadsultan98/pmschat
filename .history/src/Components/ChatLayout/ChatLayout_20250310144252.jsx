import React, { useState } from 'react';
import ContactsList from '../ContactsList/ContactsList';
import ChatWindow from '../ChatWindow/ChatWindow';
import FileModal from '../FileModal/FileModal';
import ContactsModal from '../ContactsModal/ContactsModal';
import './ChatLayout.scss';

const ChatLayout = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="chatLayout">
      <ContactsList 
        contacts={contacts} 
        selectedContact={selectedContact} 
        onContactSelect={(contact) => setSelectedContact(contact)} 
        onAddButtonClick={() => setShowContactsModal(true)}
        onSearch={(query) => setSearchQuery(query)}
        searchQuery={searchQuery}
      />
      {selectedContact && (
        <ChatWindow 
          contact={selectedContact} 
          onFileButtonClick={() => setShowFileModal(true)}
        />
      )}
      {showFileModal && (
        <FileModal onClose={() => setShowFileModal(false)} />
      )}
      {showContactsModal && (
        <ContactsModal 
          contacts={contacts}
          onClose={() => setShowContactsModal(false)}
          onContactSelect={(contact) => {
            setSelectedContact(contact);
            setShowContactsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatLayout;
import React, { useState, useEffect } from 'react';
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

  // Generate random contacts
  useEffect(() => {
    const randomContacts = [
      {
        id: 1,
        name: 'Fidan Mammadova',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'You can get an idea...',
        timestamp: '10:22',
        messages: [
          {
            id: 1,
            sender: 'contact',
            text: 'I\'m doing well, thank you! How can I help you today?',
            timestamp: 'Today 08:15'
          },
          {
            id: 2,
            sender: 'user',
            text: 'Hello, how are you doing?',
            timestamp: 'Today 08:15'
          },
          {
            id: 3,
            sender: 'contact',
            text: 'I\'m doing well, thank you! How can I help you today?',
            timestamp: 'Today 08:16'
          },
          {
            id: 4,
            sender: 'user',
            text: 'I have a question about the return policy for a product I purchased.',
            timestamp: 'Today 08:16'
          },
          {
            id: 5,
            sender: 'user',
            text: 'You can get an idea from the roll up of Bankers Club.',
            timestamp: 'Today 08:17'
          }
        ]
      },
      {
        id: 2,
        name: 'John Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'I love the design you...',
        timestamp: '14:17',
        messages: []
      },
      {
        id: 3,
        name: 'Emily Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Do you have time for...',
        timestamp: '15:54',
        messages: []
      },
      {
        id: 4,
        name: 'William Wilson',
        avatar: 'https://i.pravatar.cc/150?img=4',
        lastMessage: 'Got the confirmation...',
        timestamp: '17:05',
        messages: []
      },
      {
        id: 5,
        name: 'Charlotte Anderson',
        avatar: 'https://i.pravatar.cc/150?img=5',
        lastMessage: 'The presentation...',
        timestamp: 'yesterday 14:11',
        messages: []
      },
      {
        id: 6,
        name: 'Isabella Garcia',
        avatar: 'https://i.pravatar.cc/150?img=6',
        lastMessage: 'Just sent over the...',
        timestamp: 'yesterday 15:42',
        messages: []
      }
    ];
    
    setContacts(randomContacts);
    setSelectedContact(randomContacts[0]);
  }, []);

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

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chatLayout">
      <ContactsList 
        contacts={filteredContacts} 
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
          contacts={contacts}
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


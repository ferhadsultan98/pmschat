import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, X } from 'react-feather';
import './ContactsList.scss';

const ContactsModal = ({ contacts, onClose, onContactSelect, isOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    isOpen && (
      <div className="contactsModal">
        <div className="contactsModalContent">
          <div className="contactsModalHeader">
            <h2>Contacts</h2>
            <button className="contactsCloseButton" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          <div className="contactsSearchContainer">
            <div className="contactsSearchInput">
              <Search size={18} color="#8a8a8a" />
              <input 
                type="text" 
                placeholder="Search contacts" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="contactsModalList">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className="contactsModalItem"
                onClick={() => {
                  onContactSelect(contact);
                  onClose();
                }}
              >
                <img src={contact.avatar} alt={contact.name} className="contactsModalAvatar" />
                <div className="contactsModalName">{contact.name}</div>
              </div>
            ))}
            
            {filteredContacts.length === 0 && (
              <div className="contactsNoResults">
                No contacts found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

const ContactsList = ({ selectedContact, onContactSelect, onAddButtonClick, onSearch, searchQuery }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const randomContacts = [
      // Your existing contacts data...
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
  }, []);

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes((searchQuery || localSearchQuery).toLowerCase())
  );

  return (
    <div className="contactsList">
      <div className="contactsSearchContainer">
        <div className="contactsSearchInput">
          <Search size={18} color="#8a8a8a" />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery || localSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="contactsListHeader">
        <h2>Last Chats</h2>
        <div className="contactsHeaderActions">
          <button 
            className="contactsAddButton" 
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
          </button>
          <button className="contactsMoreButton">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      <div className="contactsContainer">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id} 
            className={`contactItem ${selectedContact && selectedContact.id === contact.id ? 'contactItemSelected' : ''}`}
            onClick={() => onContactSelect(contact)}
          >
            <div className="contactAvatar">
              <img src={contact.avatar} alt={contact.name} />
            </div>
            <div className="contactInfo">
              <div className="contactName">{contact.name}</div>
              <div className="contactLastMessage">{contact.lastMessage}</div>
            </div>
            <div className="contactTimestamp">{contact.timestamp}</div>
          </div>
        ))}
      </div>

      <ContactsModal 
        contacts={contacts}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContactSelect={onContactSelect}
      />
    </div>
  );
};

export default ContactsList;
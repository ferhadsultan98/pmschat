import React, { useState, useEffect } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle } from 'react-feather';
import { database, onValue, ref } from '../../Server/Firebase';

// Function to format timestamp
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const messageDate = new Date(Number(timestamp));
  const diffInMs = now - messageDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Get time in HH:MM format
  const timeStr = messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // If today
  if (diffInDays === 0) {
    return timeStr; // e.g., "10:22"
  }

  // If yesterday
  if (diffInDays === 1) {
    return 'Yesterday';
  }

  // If within a week
  if (diffInDays < 7) {
    return messageDate.toLocaleDateString('en-US', {
      weekday: 'long'
    }); // e.g., "Wednesday"
  }

  // If more than a week ago
  return messageDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '/'); // e.g., "10/03/2025"
};

const ContactsList = ({ selectedContact, onContactSelect, onAddButtonClick, onSearch, searchQuery }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const contactsRef = ref(database, 'contacts');
    
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactsArray = Object.entries(data).map(([id, contact]) => ({
          id,
          ...contact
        }));
        setContacts(contactsArray);
      } else {
        setContacts([]);
      }
    }, (error) => {
      console.error("Error fetching contacts:", error);
    });

    return () => unsubscribe();
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

  const handleContactSelect = (contact) => {
    onContactSelect(contact);
    setIsOpen(false);
  };

  const toggleContacts = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className="contactsToggleButton"
        onClick={toggleContacts}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageCircle size={20} />
        <span>Chats</span>
      </button>

      <div className={`contactsList ${isOpen ? 'isOpen' : ''}`}>
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
            <button className="contactsAddButton" onClick={onAddButtonClick}>
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
              onClick={() => handleContactSelect(contact)}
            >
              <div className="contactAvatar">
                <img src={contact.avatar} alt={contact.name} />
              </div>
              <div className="contactInfo">
                <div className="contactName">{contact.name}</div>
                <div className="contactLastMessage">{contact.lastMessage}</div>
              </div>
              <div className="contactTimestamp">
                {formatTimestamp(contact.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactsList;
import React, { useState, useEffect } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle } from 'react-feather';
import { database, ref, onValue } from '../../Server/Firebase';
import moment from 'moment'; // Import Moment.js

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  const now = moment();
  const messageDate = moment(Number(timestamp));

  const isSameDay = now.isSame(messageDate, 'day');
  const diffInDays = now.diff(messageDate, 'days');

  if (isSameDay) {
    return messageDate.format('HH:mm'); // 24-hour format
  }
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return messageDate.format('dddd HH:mm'); // Day name + time
  }

  return messageDate.format('DD/MM/YYYY'); // Full date
};

const ContactsList = ({
  selectedContact,
  onContactSelect,
  onAddButtonClick,
  onSearch,
  searchQuery,
}) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const usersRef = ref(database, 'users');

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactsArray = Object.entries(data).map(([id, user]) => ({
            id,
            name: user.fullName,
            avatar: user.avatar || 'https://via.placeholder.com/40',
            timestamp: user.createdAt,
            lastMessage: user.lastMessage || 'No messages yet',
          }));
          setContacts(contactsArray);
        } else {
          setContacts([]);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name
      .toLowerCase()
      .includes((searchQuery || localSearchQuery).toLowerCase())
  );

  const handleContactSelect = (contact) => {
    onContactSelect(contact);
    setIsOpen(false);
  };

  const toggleContacts = () => setIsOpen(!isOpen);

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
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`contactItem ${
                selectedContact && selectedContact.id === contact.id
                  ? 'contactItemSelected'
                  : ''
              }`}
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
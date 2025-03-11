import React from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical } from 'react-feather';

const ContactsList = ({ contacts, selectedContact, onContactSelect, onAddButtonClick, onSearch, searchQuery }) => {
  return (
    <div className="contactsList">
      <div className="contactsSearchContainer">
        <div className="contactsSearchInput">
          <Search size={18} color="#8a8a8a" />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
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
        {contacts.map(contact => (
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
    </div>
  );
};

export default ContactsList;


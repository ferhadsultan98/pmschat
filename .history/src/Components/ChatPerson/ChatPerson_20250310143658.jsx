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

// src/components/ContactsList/ContactsList.scss
.contactsList {
  width: 340px;
  height: 100%;
  background-color: #121212;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  
  .contactsSearchContainer {
    padding: 16px;
    
    .contactsSearchInput {
      background-color: #1e1e1e;
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      
      input {
        background: transparent;
        border: none;
        outline: none;
        color: #ffffff;
        width: 100%;
        margin-left: 10px;
        font-size: 14px;
        
        &::placeholder {
          color: #8a8a8a;
        }
      }
    }
  }
  
  .contactsListHeader {
    padding: 0 16px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      font-size: 16px;
      font-weight: 600;
    }
    
    .contactsHeaderActions {
      display: flex;
      
      button {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        color: #8a8a8a;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        
        &:hover {
          background-color: #2a2a2a;
        }
      }
    }
  }
  
  .contactsContainer {
    flex: 1;
    overflow-y: auto;
    
    .contactItem {
      display: flex;
      padding: 12px 16px;
      cursor: pointer;
      position: relative;
      
      &:hover {
        background-color: #1e1e1e;
      }
      
      &.contactItemSelected {
        background-color: #2a2a2a;
      }
      
      .contactAvatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .contactInfo {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        
        .contactName {
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .contactLastMessage {
          font-size: 12px;
          color: #8a8a8a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 4px;
        }
      }
      
      .contactTimestamp {
        font-size: 12px;
        color: #8a8a8a;
        align-self: flex-start;
        margin-top: 2px;
      }
    }
  }
}

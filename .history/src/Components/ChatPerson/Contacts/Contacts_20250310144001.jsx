import React, { useState } from 'react';
import { X, Search } from 'react-feather';
import './ContactsModal.scss';

const ContactsModal = ({ contacts, onClose, onContactSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
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
              onClick={() => onContactSelect(contact)}
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
  );
};

export default ContactsModal;

// src/components/ContactsModal/ContactsModal.scss
.contactsModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .contactsModalContent {
    width: 400px;
    max-height: 80vh;
    background-color: #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .contactsModalHeader {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #2a2a2a;
      
      h2 {
        font-size: 16px;
        font-weight: 600;
      }
      
      .contactsCloseButton {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        color: #8a8a8a;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: #ffffff;
        }
      }
    }
    
    .contactsSearchContainer {
      padding: 12px 16px;
      border-bottom: 1px solid #2a2a2a;
      
      .contactsSearchInput {
        background-color: #252525;
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
    
    .contactsModalList {
      overflow-y: auto;
      max-height: 400px;
      padding: 8px 0;
      
      .contactsModalItem {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        
        &:hover {
          background-color: #222;
        }
        
        .contactsModalAvatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 12px;
        }
        
        .contactsModalName {
          font-size: 14px;
          font-weight: 500;
        }
      }
      
      .contactsNoResults {
        padding: 16px;
        text-align: center;
        color: #8a8a8a;
        font-size: 14px;
      }
    }
  }
}
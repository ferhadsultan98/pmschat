import React, { useState } from 'react';
import { X, Search } from 'react-feather';
import './ContactsModal.scss';

const ContactsModal = ({ contacts = [], onContactSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    onContactSelect(contact);
    setIsOpen(false);
    setSearchQuery(''); // Reset search when closing
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery(''); // Reset search when closing
  };

  return (
    <>
      {!isOpen && (
        <button 
          className="contactsOpenButton"
          onClick={() => setIsOpen(true)}
        >
          Open Contacts
        </button>
      )}

      {isOpen && (
        <div className="contactsModal">
          <div className="contactsModalContent">
            <div className="contactsModalHeader">
              <h2>Contacts</h2>
              <button className="contactsCloseButton" onClick={handleClose}>
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
                  onClick={() => handleContactSelect(contact)}
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
      )}
    </>
  );
};

export default ContactsModal;
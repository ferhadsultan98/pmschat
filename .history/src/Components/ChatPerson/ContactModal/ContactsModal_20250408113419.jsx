import React, { useState, useEffect } from 'react';
import { X, Search } from 'react-feather';
import './ContactsModal.scss';
import { database, ref, onValue } from '../../../Server/Firebase'; 
import './ContactsModal.scss'

const ContactsModal = ({ onClose, onContactSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);


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

  const filteredContacts = contacts.filter((contact) =>
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
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="contactsModalItem"
              onClick={() => onContactSelect(contact)}
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="contactsModalAvatar"
              />
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
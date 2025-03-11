import React from 'react';
import { Trash2 } from 'react-feather';
import PropTypes from 'prop-types';
import './ContactItem.scss';

const ContactItem = ({ contact, selectedContact, onContactSelect, onDeleteContact }) => {
  const isSelected = selectedContact && selectedContact.id === contact.id;

  return (
    <div
      className={`contactItem ${isSelected ? 'contactItemSelected' : ''}`}
      onClick={() => onContactSelect(contact)}
    >
      <div className="contactAvatar">
        <img src={contact.avatar} alt={contact.name} />
      </div>
      <div className="contactInfo">
        <div className="contactName">{contact.name}</div>
        <div className="contactLastMessage">{contact.lastMessage}</div>
      </div>
      <div className="contactTimestamp">{contact.formattedTimestamp}</div>
      <button
        className="deleteContactButton"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteContact(contact.id);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

ContactItem.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    lastMessage: PropTypes.string,
    formattedTimestamp: PropTypes.string,
  }).isRequired,
  selectedContact: PropTypes.object,
  onContactSelect: PropTypes.func.isRequired,
  onDeleteContact: PropTypes.func.isRequired,
};

export default ContactItem;
import React, { useState, useEffect, useRef } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle, LogOut, Trash2 } from 'react-feather';
import { database, ref, onValue, remove, set } from '../../Server/Firebase';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContactsModal from './ContactsModal'; // Import the new ContactsModal

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  const now = moment();
  const messageDate = moment(Number(timestamp));

  const isSameDay = now.isSame(messageDate, 'day');
  const diffInDays = now.diff(messageDate, 'days');

  if (isSameDay) {
    return messageDate.format('HH:mm');
  }
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return messageDate.format('dddd HH:mm');
  }

  return messageDate.format('DD/MM/YYYY');
};

const ContactsList = ({
  selectedContact,
  onContactSelect,
  onSearch,
  searchQuery,
}) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the new modal
  const moreButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const chatsRef = ref(database, `chats/${userId}/contacts`);

    const unsubscribe = onValue(
      chatsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactsArray = Object.entries(data).map(([id, contact]) => ({
            id,
            name: contact.name,
            avatar: contact.avatar || 'https://via.placeholder.com/40',
            timestamp: contact.timestamp,
            lastMessage: contact.lastMessage || 'No messages yet',
          }));
          setContacts(contactsArray);
        } else {
          setContacts([]);
        }
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  const toggleMoreMenu = () => setIsMoreOpen(!isMoreOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success('Successfully logged out!', {
      position: 'top-right',
      autoClose: 3000,
    });
    setIsMoreOpen(false);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleAddContact = async (contact) => {
    const userId = sessionStorage.getItem('userId');
    const senderContactRef = ref(database, `chats/${userId}/contacts/${contact.id}`);
    const receiverContactRef = ref(database, `chats/${contact.id}/contacts/${userId}`);

    try {
      await set(senderContactRef, {
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: 'No messages yet',
        timestamp: Date.now(),
      });

      await set(receiverContactRef, {
        name: sessionStorage.getItem('fullName'),
        avatar: sessionStorage.getItem('avatar') || 'https://via.placeholder.com/40',
        lastMessage: 'No messages yet',
        timestamp: Date.now(),
      });

      toast.success(`${contact.name} added to your contacts!`, {
        position: 'top-right',
        autoClose: 2000,
      });
      setIsModalOpen(false); // Close the modal after adding
    } catch (error) {
      toast.error('Error adding contact: ' + error.message, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const handleDeleteContact = async (contactId) => {
    const userId = sessionStorage.getItem('userId');
    const contactRef = ref(database, `chats/${userId}/contacts/${contactId}`);

    try {
      await remove(contactRef);
      toast.success('Contact deleted successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Error deleting contact: ' + error.message, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
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
            <button
              className="contactsAddButton"
              onClick={() => setIsModalOpen(true)} // Open the new modal
            >
              <Plus size={20} />
            </button>
            <div className="moreMenuContainer" ref={moreButtonRef}>
              <button className="contactsMoreButton" onClick={toggleMoreMenu}>
                <MoreVertical size={20} />
              </button>
              <div className={`moreDropdown ${isMoreOpen ? 'show' : ''}`}>
                <button className="dropdownItem" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
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
              <button
                className="deleteContactButton"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteContact(contact.id);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <ContactsModal
          onClose={() => setIsModalOpen(false)}
          onContactSelect={handleAddContact} // Pass the handleAddContact function
        />
      )}
    </>
  );
};

export default ContactsList;
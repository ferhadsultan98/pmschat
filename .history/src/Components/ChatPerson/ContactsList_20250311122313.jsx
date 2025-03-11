import React, { useState, useEffect, useRef } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle, LogOut, Trash2 } from 'react-feather';
import { database, ref, onValue, remove } from '../../Server/Firebase';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

// Add ToastContainer to your app (usually in App.js or index.js)
import { ToastContainer } from 'react-toastify';

// Add this in your App.js or index.js:
// <ToastContainer 
//   position="top-right"
//   autoClose={3000}
//   hideProgressBar={false}
//   newestOnTop={false}
//   closeOnClick
//   rtl={false}
//   pauseOnFocusLoss
//   draggable
//   pauseOnHover
// />

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
  onAddButtonClick,
  onSearch,
  searchQuery,
}) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreButtonRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate hook

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
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Show success toast
    toast.success('Successfully logged out!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });


    setIsMoreOpen(false);
    

    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleDeleteAllChats = () => {
    const usersRef = ref(database, 'users');
    remove(usersRef)
      .then(() => {
        console.log('All chats deleted successfully');
        setContacts([]);
        setIsMoreOpen(false);
        toast.success('All chats deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting chats:', error);
        toast.error('Failed to delete chats');
      });
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
            <div className="moreMenuContainer" ref={moreButtonRef}>
              <button className="contactsMoreButton" onClick={toggleMoreMenu}>
                <MoreVertical size={20} />
              </button>
              <div className={`moreDropdown ${isMoreOpen ? 'show' : ''}`}>
                <button className="dropdownItem" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
                <button className="dropdownItem" onClick={handleDeleteAllChats}>
                  <Trash2 size={16} />
                  <span>Delete All Chats</span>
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactsList;
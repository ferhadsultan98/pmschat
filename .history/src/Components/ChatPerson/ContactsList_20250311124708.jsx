import React, { useState, useEffect, useRef } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle, LogOut, Trash2 } from 'react-feather';
import { database, ref, onValue, remove, set, get } from '../../Server/Firebase';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]); // Mesaj geçmişi için
  const moreButtonRef = useRef(null);
  const navigate = useNavigate();

  // Kullanıcı kontaklarını dinle
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

  // Kayıtlı kullanıcıları al (Add modal için)
  useEffect(() => {
    if (isAddModalOpen) {
      const usersRef = ref(database, 'users');
      get(usersRef)
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userId = sessionStorage.getItem('userId');
            const usersArray = Object.entries(data)
              .filter(([id]) => id !== userId)
              .map(([id, user]) => ({
                id,
                name: user.fullName,
                avatar: user.avatar || 'https://via.placeholder.com/40',
                username: user.username,
              }));
            setAvailableUsers(usersArray);
          } else {
            setAvailableUsers([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    }
  }, [isAddModalOpen]);

  // Seçilen kontağın mesaj geçmişini dinle
  useEffect(() => {
    if (selectedContact) {
      const userId = sessionStorage.getItem('userId');
      const chatId = [userId, selectedContact.id].sort().join('_');
      const messagesRef = ref(database, `messages/${chatId}`);

      const unsubscribe = onValue(
        messagesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messagesArray = Object.entries(data).map(([id, msg]) => ({
              id,
              sender: msg.sender,
              text: msg.text,
              timestamp: msg.timestamp,
            }));
            setMessages(messagesArray);
          } else {
            setMessages([]);
          }
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedContact]);

  // More menü için tıklama dışı kapatma
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

  // Yeni kontak ekleme (iki yönlü)
  const handleAddContact = async (contactId, contactData) => {
    const userId = sessionStorage.getItem('userId');
    const senderContactRef = ref(database, `chats/${userId}/contacts/${contactId}`);
    const receiverContactRef = ref(database, `chats/${contactId}/contacts/${userId}`);

    try {
      await set(senderContactRef, {
        name: contactData.name,
        avatar: contactData.avatar,
        lastMessage: 'No messages yet',
        timestamp: Date.now(),
      });

      await set(receiverContactRef, {
        name: sessionStorage.getItem('fullName'),
        avatar: sessionStorage.getItem('avatar') || 'https://via.placeholder.com/40',
        lastMessage: 'No messages yet',
        timestamp: Date.now(),
      });

      toast.success(`${contactData.name} added to your contacts!`, {
        position: 'top-right',
        autoClose: 2000,
      });
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error('Error adding contact: ' + error.message, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  // Kontak silme
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

  // Mesaj gönderme
  const handleSendMessage = async (contactId) => {
    if (!messageText.trim()) return;

    const userId = sessionStorage.getItem('userId');
    const chatId = [userId, contactId].sort().join('_');
    const messageRef = ref(database, `messages/${chatId}/${Date.now()}`);
    const senderContactRef = ref(database, `chats/${userId}/contacts/${contactId}`);
    const receiverContactRef = ref(database, `chats/${contactId}/contacts/${userId}`);

    const messageData = {
      sender: userId,
      text: messageText,
      timestamp: Date.now(),
    };

    try {
      await set(messageRef, messageData);

      const senderData = (await get(senderContactRef)).val();
      const receiverData = (await get(receiverContactRef)).val();

      await set(senderContactRef, {
        name: senderData.name,
        avatar: senderData.avatar,
        lastMessage: messageText,
        timestamp: Date.now(),
      });

      await set(receiverContactRef, {
        name: receiverData.name,
        avatar: receiverData.avatar,
        lastMessage: messageText,
        timestamp: Date.now(),
      });

      setMessageText(''); // Inputu temizle
      toast.success('Message sent!', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Error sending message: ' + error.message, {
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
              onClick={() => setIsAddModalOpen(true)}
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

        {/* Mesaj Gönderme ve Geçmiş Alanı */}
        {selectedContact && (
          <div className="messageSection">
            <div className="messagesContainer">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender === sessionStorage.getItem('userId')
                      ? 'sent'
                      : 'received'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span>{formatTimestamp(msg.timestamp)}</span>
                </div>
              ))}
            </div>
            <div className="messageInputContainer">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message ${selectedContact.name}`}
                onKeyPress={(e) =>
                  e.key === 'Enter' && handleSendMessage(selectedContact.id)
                }
              />
              <button onClick={() => handleSendMessage(selectedContact.id)}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Select a Contact</h3>
            <div className="usersList">
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="userItem"
                    onClick={() => handleAddContact(user.id, user)}
                  >
                    <div className="contactAvatar">
                      <img src={user.avatar} alt={user.name} />
                    </div>
                    <div className="contactInfo">
                      <div className="contactName">{user.name}</div>
                      <div className="contactUsername">{user.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No users available</p>
              )}
            </div>
            <div className="modalActions">
              <button onClick={() => setIsAddModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactsList;
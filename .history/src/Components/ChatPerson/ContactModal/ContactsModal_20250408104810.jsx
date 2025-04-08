import React, { useState, useEffect } from 'react';
import { X, Search } from 'react-feather';
import './ContactsModal.scss';
import { database, ref, onValue, push, set, get } from '../../../Server/Firebase'; 

const ContactsModal = ({ onClose, onContactSelect, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser.userId) return;

    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Filter out the current user and get only other users
          const contactsArray = Object.entries(data)
            .filter(([id]) => id !== currentUser.userId)
            .map(([id, user]) => ({
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
  }, [currentUser]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = async (contact) => {
    if (!currentUser || !currentUser.userId) return;

    try {
      // First check if chat already exists between these two users
      const chatsRef = ref(database, 'chats');
      const chatsSnapshot = await get(chatsRef);
      const chatsData = chatsSnapshot.val() || {};
      
      // Try to find an existing chat between these two users
      let existingChat = null;
      let existingChatId = null;
      
      Object.entries(chatsData).forEach(([chatId, chat]) => {
        const participants = chat.participants || {};
        if (participants[currentUser.userId] && participants[contact.id]) {
          existingChat = chat;
          existingChatId = chatId;
        }
      });
      
      if (existingChat) {
        // Chat already exists, use this chat
        const enhancedContact = {
          ...contact,
          chatId: existingChatId
        };
        onContactSelect(enhancedContact);
      } else {
        // Create a new chat
        const newChatRef = push(ref(database, 'chats'));
        const newChatId = newChatRef.key;
        
        // Set initial chat data
        await set(newChatRef, {
          participants: {
            [currentUser.userId]: true,
            [contact.id]: true
          },
          createdAt: Date.now(),
          // Initialize with an empty messages object
          messages: {}
        });
        
        // Create an enhanced contact object with the chat ID
        const enhancedContact = {
          ...contact,
          chatId: newChatId,
          lastMessage: "No messages yet",
          timestamp: Date.now()
        };
        
        onContactSelect(enhancedContact);
      }
    } catch (error) {
      console.error("Error creating or finding chat:", error);
    }
  };

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
              onClick={() => handleContactSelect(contact)}
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
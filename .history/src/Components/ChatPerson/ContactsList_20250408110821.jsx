import React, { useState, useEffect, useCallback } from "react";
import "./ContactsList.scss";
import { Search, Plus, MoreVertical, LogOut } from "react-feather";
import { database, ref, onValue, get } from "../../Server/Firebase";
import moment from "moment";
import ContactsModal from "./ContactModal/ContactsModal";
import { useNavigate } from "react-router-dom";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const now = moment();
  const messageDate = moment(Number(timestamp));
  const isSameDay = now.isSame(messageDate, "day");
  const diffInDays = now.diff(messageDate, "days");
  if (isSameDay) return messageDate.format("HH:mm");
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return messageDate.format("dddd HH:mm");
  return messageDate.format("DD/MM/YYYY");
};

const ContactsList = ({ onContactSelect, currentUser, isOpen }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchContacts = useCallback(async () => {
    if (!currentUser?.userId) {
      setContacts([]);
      return;
    }

    const chatsRef = ref(database, "chats");
    onValue(chatsRef, async (snapshot) => {
      const chatsData = snapshot.val();
      if (!chatsData) {
        setContacts([]);
        return;
      }

      const userChats = Object.entries(chatsData).filter(([_, chat]) => 
        chat.participants?.[currentUser.userId] === true
      );

      if (!userChats.length) {
        setContacts([]);
        return;
      }

      const chatUserIds = new Set();
      userChats.forEach(([_, chat]) => {
        Object.keys(chat.participants || {}).forEach(userId => {
          if (userId !== currentUser.userId) chatUserIds.add(userId);
        });
      });

      const usersRef = ref(database, "users");
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val() || {};

      const contactsWithLastMessage = Array.from(chatUserIds)
        .map(userId => {
          const userData = usersData[userId];
          if (!userData) return null;

          const chatWithUser = userChats.find(([_, chat]) => 
            chat.participants?.[userId]
          );
          const chatId = chatWithUser ? chatWithUser[0] : null;
          const chatData = chatWithUser ? chatWithUser[1] : null;

          let lastMessage = userData.lastMessage || "No messages yet";
          let timestamp = userData.createdAt;

          if (chatData?.messages) {
            const messages = Object.values(chatData.messages);
            if (messages.length) {
              const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
              lastMessage = sortedMessages[0].text;
              timestamp = sortedMessages[0].timestamp;
            }
          }

          return {
            id: userId,
            chatId,
            name: userData.fullName || "Unknown",
            avatar: userData.avatar || "https://via.placeholder.com/40",
            timestamp,
            lastMessage,
          };
        })
        .filter(contact => contact !== null);

      contactsWithLastMessage.sort((a, b) => b.timestamp - a.timestamp);
      setContacts(contactsWithLastMessage);
    }, (error) => {
      console.error(error);
      setContacts([]);
    });
  }, [currentUser]);

  useEffect(() => {
    fetchContacts();
    return () => {
      const chatsRef = ref(database, "chats");
      onValue(chatsRef, () => {});
    };
  }, [fetchContacts]);

  const handleSearch = (e) => setLocalSearchQuery(e.target.value);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    setSelectedContactId(contact.id);
    onContactSelect({ ...contact, chatId: contact.chatId });
  };

  const handleAddButtonClick = () => setShowContactsModal(true);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <div className={`contactsList ${isOpen ? "isOpen" : ""}`}>
      <div className="contactsSearchContainer">
        <div className="contactsSearchInput">
          <Search size={18} color="#8a8a8a" />
          <input
            type="text"
            placeholder="Search"
            value={localSearchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="contactsListHeader">
        <h2>Last Chats</h2>
        <div className="contactsHeaderActions">
          <button className="contactsAddButton" onClick={handleAddButtonClick}>
            <Plus size={20} />
          </button>
          <div className="dropdownContainer">
            <button className="contactsMoreButton" onClick={toggleDropdown}>
              <MoreVertical size={20} />
            </button>
            {showDropdown && (
              <div className="dropdownMenu">
                <button className="dropdownItem" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="contactsContainer">
        {filteredContacts.length ? (
          filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`contactItem ${selectedContactId === contact.id ? "selected" : ""}`}
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
          ))
        ) : (
          <div className="noChatsMessage">
            No chats found. Start a new conversation!
          </div>
        )}
      </div>

      {showContactsModal && (
        <ContactsModal
          onClose={() => setShowContactsModal(false)}
          currentUser={currentUser}
          onContactSelect={(contact) => {
            handleContactSelect(contact);
            setShowContactsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ContactsList;
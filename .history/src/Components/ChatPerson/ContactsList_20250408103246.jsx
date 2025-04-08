import React, { useState, useEffect } from "react";
import "./ContactsList.scss";
import { Search, Plus, MoreVertical, LogOut } from "react-feather";
import { IoIosArrowBack } from "react-icons/io";
import { database, ref, onValue } from "../../Server/Firebase";
import moment from "moment";
import ContactsModal from "./ContactModal/ContactsModal";
// import { useNavigate } from "react-router-dom";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";

  const now = moment();
  const messageDate = moment(Number(timestamp));

  const isSameDay = now.isSame(messageDate, "day");
  const diffInDays = now.diff(messageDate, "days");

  if (isSameDay) {
    return messageDate.format("HH:mm");
  }
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 7) {
    return messageDate.format("dddd HH:mm");
  }
  return messageDate.format("DD/MM/YYYY");
};

const ContactsList = ({ onContactSelect, currentUser, isOpen }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  // const [showDropdown, setShowDropdown] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    // Check if currentUser exists and has userId
    if (!currentUser || !currentUser.userId) {
      console.error("Current user information is missing");
      return;
    }

    const usersRef = ref(database, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Make sure we properly filter out the current user from the contacts list
          const contactsArray = Object.entries(data)
            .filter(([id]) => id !== currentUser.userId) // This ensures current user is not in the list
            .map(([id, user]) => ({
              id,
              name: user.fullName,
              avatar: user.avatar || "https://via.placeholder.com/40",
              timestamp: user.createdAt,
              lastMessage: user.lastMessage || "No messages yet",
            }));
          setContacts(contactsArray);
        } else {
          setContacts([]);
        }
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    setSelectedContactId(contact.id);
    onContactSelect(contact);
  };

  const handleAddButtonClick = () => {
    setShowContactsModal(true);
  };

  // const toggleDropdown = () => {
  //   setShowDropdown(!showDropdown);
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem("auth");
  //   setShowDropdown(false);
  //   navigate("/login");
  // };

  return (
    <>
      <div className={`contactsList ${isOpen ? "isOpen" : ""}`}>
        <div className="contactsSearchContainer">
          <div className="contactsSearchInput">
            <Search size={18} color="#8a8a8a" />
            <input
              type="text"
              placeholder="Search"
              value={localSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="contactsListHeader">
          <h2>Last Chats</h2>
          <div className="contactsHeaderActions">
            <button
              className="contactsAddButton"
              onClick={handleAddButtonClick}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="contactsContainer">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`contactItem ${
                  selectedContactId === contact.id ? "selected" : ""
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
            ))
          ) : (
            <div className="noContactsMessage">
              <p>No contacts found. Add new contacts to start chatting!</p>
            </div>
          )}
        </div>
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
    </>
  );
};

export default ContactsList;
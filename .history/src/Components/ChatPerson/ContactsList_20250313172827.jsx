import React, { useState, useEffect } from "react";
import "./ContactsList.scss";
import { Search, Plus, MoreVertical, LogOut } from "react-feather";
import { IoIosArrowBack } from "react-icons/io";
import { database, ref, onValue } from "../../Server/Firebase";
import moment from "moment";
import ContactsModal from "./ContactModal/ContactsModal";
import { useNavigate } from "react-router-dom";

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

const ContactsList = ({ onContactSelect, currentUser }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactsArray = Object.entries(data)
            .filter(([id]) => id !== currentUser.userId) 
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
  }, [currentUser.userId]);

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    setSelectedContactId(contact.id);
    onContactSelect(contact);
    setIsOpen(false);
  };

  const handleAddButtonClick = () => {
    setShowContactsModal(true);
  };



  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <>

      <div className="contactsList">
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
          {filteredContacts.map((contact) => (
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
          ))}
        </div>
      </div>

      {showContactsModal && (
        <ContactsModal
          onClose={() => setShowContactsModal(false)}
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
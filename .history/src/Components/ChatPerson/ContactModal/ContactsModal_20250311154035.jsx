import React, { useState, useEffect } from "react";
import { X, Search } from "react-feather";
import "./ContactsModal.scss";
import { database, ref, onValue } from "../../../Server/Firebase";

const ContactsModal = ({ onClose, onContactSelect, existingContacts = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    setLoading(true);
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            const contactsArray = Object.entries(data)
              .filter(([id]) => id !== userId && !existingContacts.includes(id))
              .map(([id, user]) => ({
                id,
                name: user.fullName,
                avatar: user.avatar || "https://via.placeholder.com/40",
              }));
            setContacts(contactsArray);
          } else {
            setContacts([]);
          }
          setError(null);
        } catch (err) {
          setError("Failed to load users.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Database error: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [existingContacts]);

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
          {loading ? (
            <div>Loading users...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredContacts.length === 0 ? (
            <div className="contactsNoResults">
              {searchQuery
                ? `No contacts found matching "${searchQuery}"`
                : "No new contacts available."}
            </div>
          ) : (
            filteredContacts.map((contact) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;
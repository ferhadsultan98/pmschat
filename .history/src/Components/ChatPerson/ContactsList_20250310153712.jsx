import React, { useState, useEffect } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle } from 'react-feather';
import { database, ref, onValue, auth } from '../../Server/Firebase'; // Firebase utilities
import { onAuthStateChanged } from 'firebase/auth';

const ContactsList = ({ selectedContact, onContactSelect, onAddButtonClick, onSearch, searchQuery }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kimlik doğrulama durumunu takip et
  const ALLOWED_UID = "TYNt14EbveTHQvSOiWFCxlQP7wz1"; // Firebase dosyanızdan alınmış UID

  useEffect(() => {
    // Kullanıcı kimlik doğrulama durumunu kontrol et
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ALLOWED_UID) {
        setIsAuthenticated(true);
        console.log("Yetkili kullanıcı giriş yaptı:", user.uid);
      } else {
        setIsAuthenticated(false);
        setContacts([]); // Yetkisiz kullanıcıysa contacts'ı sıfırla
        console.log("Yetkisiz kullanıcı veya giriş yok. UID:", user ? user.uid : "Yok");
      }
    });

    return () => unsubscribeAuth(); // Auth listener'ı temizle
  }, []);

  useEffect(() => {
    // Yalnızca kimlik doğrulanmışsa verileri çek
    if (!isAuthenticated) {
      console.log("Kimlik doğrulama bekleniyor, veriler çekilmedi.");
      return;
    }

    const contactsRef = ref(database, 'contacts');
    
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactsArray = Object.entries(data).map(([id, contact]) => ({
          id,
          ...contact,
        }));
        setContacts(contactsArray);
      } else {
        setContacts([]);
      }
    }, (error) => {
      console.error("Error fetching contacts:", error.message);
    });

    return () => unsubscribe(); // Veritabanı listener'ını temizle
  }, [isAuthenticated]); // isAuthenticated değiştiğinde useEffect tekrar çalışır

  const handleSearch = (query) => {
    setLocalSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes((searchQuery || localSearchQuery).toLowerCase())
  );

  const handleContactSelect = (contact) => {
    onContactSelect(contact);
    setIsOpen(false);
  };

  const toggleContacts = () => {
    setIsOpen(!isOpen);
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
            <button className="contactsMoreButton">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
        
        <div className="contactsContainer">
          {!isAuthenticated ? (
            <div className="noAuthMessage">Lütfen giriş yapın.</div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className={`contactItem ${selectedContact && selectedContact.id === contact.id ? 'contactItemSelected' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="contactAvatar">
                  <img src={contact.avatar} alt={contact.name} />
                </div>
                <div className="contactInfo">
                  <div className="contactName">{contact.name}</div>
                  <div className="contactLastMessage">{contact.lastMessage}</div>
                </div>
                <div className="contactTimestamp">{contact.timestamp}</div>
              </div>
            ))
          ) : (
            <div className="noContactsMessage">Hiçbir kişi bulunamadı.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactsList;
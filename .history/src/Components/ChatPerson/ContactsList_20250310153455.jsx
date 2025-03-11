import React, { useState, useEffect } from 'react';
import './ContactsList.scss';
import { Search, Plus, MoreVertical, MessageCircle } from 'react-feather';
import { database, onValue, ref, auth } from '../../Server/Firebase'; // auth'u da import et
import { onAuthStateChanged } from 'firebase/auth';

const ContactsList = ({ selectedContact, onContactSelect, onAddButtonClick, onSearch, searchQuery }) => {
  const [contacts, setContacts] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kimlik doğrulama durumunu takip et
  const [error, setError] = useState(null); // Hata mesajlarını tutmak için

  useEffect(() => {
    // Kullanıcı oturum durumunu kontrol et
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === 'TYNt14EbveTHQvSOiWFCxlQP7wz1') {
        setIsAuthenticated(true);
        setError(null);
      } else {
        setIsAuthenticated(false);
        setError('Lütfen giriş yapın veya yetkili kullanıcıyla oturum açın.');
        setContacts([]); // Verileri sıfırla
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return; // Kullanıcı giriş yapmadıysa veri çekme

    const contactsRef = ref(database, 'contacts');
    
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactsArray = Object.entries(data).map(([id, contact]) => ({
          id,
          ...contact
        }));
        setContacts(contactsArray);
      } else {
        setContacts([]);
      }
    }, (error) => {
      console.error("Error fetching contacts:", error);
      setError('Kişiler yüklenirken bir hata oluştu.');
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

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
        {error && <div className="errorMessage">{error}</div>} {/* Hata mesajını göster */}
        
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
          {filteredContacts.length > 0 ? (
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
            <div>Hiç kişi bulunamadı.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactsList;
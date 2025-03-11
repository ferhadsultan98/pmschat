import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, MoreHorizontal } from 'react-feather';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.scss';
import { database, ref, push, update, onValue, serverTimestamp } from '../../Server/Firebase';

const ChatWindow = ({ contact, onFileButtonClick }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  // Mesajları Firebase'den gerçek zamanlı olarak dinle
  useEffect(() => {
    if (!contact?.id) return;

    const messagesRef = ref(database, `contacts/${contact.id}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
      scrollToBottom();
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    // Temizlik (unsubscribe) fonksiyonu
    return () => unsubscribe();
  }, [contact?.id]);

  // Mesajlar güncellendiğinde en alta kaydır
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mesaj gönderme fonksiyonu
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !contact?.id) return;

    const messagesRef = ref(database, `contacts/${contact.id}/messages`);
    const contactRef = ref(database, `contacts/${contact.id}`);

    const newMessage = {
      sender: 'user',
      text: message.trim(),
      timestamp: serverTimestamp(), // Firebase sunucu zaman damgası
    };

    push(messagesRef, newMessage)
      .then(() => {
        update(contactRef, {
          lastMessage: message.trim(),
          timestamp: serverTimestamp(),
        });
        setMessage(''); // Inputu temizle
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        alert('Mesaj gönderilirken bir hata oluştu.');
      });
  };

  // Emoji seçimi
  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Kontakt seçilmediyse
  if (!contact) {
    return (
      <div className="chatWindow">
        <div className="chatHeader">
          <h2>Bir kontakt seçerek sohbete başlayın</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="chatWindow">
      <div className="chatHeader">
        <div className="chatContactInfo">
          <img src={contact.avatar} alt={contact.name} className="chatAvatar" />
          <h2>{contact.name}</h2>
        </div>
        <button className="chatMoreButton">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="chatMessagesContainer">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chatMessage ${msg.sender === 'user' ? 'chatMessageUser' : 'chatMessageContact'}`}
            >
              {msg.sender === 'contact' && (
                <img src={contact.avatar} alt={contact.name} className="chatMessageAvatar" />
              )}
              <div className="chatMessageContent">
                <div className="chatMessageText">{msg.text}</div>
                <div className="chatMessageTimestamp">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Gönderiliyor...'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="noMessages">Henüz mesaj yok</div>
        )}
        <div ref={messageEndRef} />
      </div>

      <form className="chatInputContainer" onSubmit={handleSendMessage}>
        <div className="chatMessageActions">
          <button
            type="button"
            className="chatEmojiButton"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={24} />
          </button>
          {showEmojiPicker && (
            <div className="chatEmojiPickerContainer">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <button type="button" className="chatAttachmentButton" onClick={onFileButtonClick}>
            <Paperclip size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Cevap yaz ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="chatSendButton">
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
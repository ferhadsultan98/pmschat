import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, MoreHorizontal } from 'react-feather';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.scss';
import { database, ref, onValue, push, serverTimestamp } from '../../Server/Firebase';

const ChatWindow = ({ contact, onFileButtonClick }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    if (!contact?.id) return;

    // Reference to messages for this specific contact
    const messagesRef = ref(database, `messages/${contact.id}`);
    
    // Real-time listener for messages
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    // Scroll to bottom when messages change
    scrollToBottom();

    // Cleanup subscription
    return () => unsubscribe();
  }, [contact?.id]);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !contact?.id) return;
    
    // Reference to messages for this contact
    const messagesRef = ref(database, `messages/${contact.id}`);
    
    // Send message to Firebase
    push(messagesRef, {
      text: message.trim(),
      sender: 'user',
      timestamp: serverTimestamp(), // Firebase server timestamp
    })
    .then(() => {
      setMessage('');
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
  };
  
  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // If no contact is selected
  if (!contact) {
    return (
      <div className="chatWindow">
        <div className="chatHeader">
          <h2>Select a contact to start chatting</h2>
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
          messages.map(msg => (
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
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Sending...'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="noMessages">No messages yet</div>
        )}
        <div ref={messageEndRef} />
      </div>
      
      <form className="chatInputContainer" onSubmit={handleSendMessage}>
        <div className="chatMessageActions">
          <button type="button" className="chatEmojiButton" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
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
          placeholder="Reply ..." 
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
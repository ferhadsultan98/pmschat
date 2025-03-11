import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, Send, MoreHorizontal } from 'react-feather';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.scss';

const ChatWindow = ({ contact, onFileButtonClick }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [contact.messages]);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, you would send this message to the backend
    // For now, we'll just clear the input
    setMessage('');
  };
  
  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
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
        {contact.messages.map(msg => (
          <div 
            key={msg.id} 
            className={`chatMessage ${msg.sender === 'user' ? 'chatMessageUser' : 'chatMessageContact'}`}
          >
            {msg.sender === 'contact' && (
              <img src={contact.avatar} alt={contact.name} className="chatMessageAvatar" />
            )}
            <div className="chatMessageContent">
              <div className="chatMessageText">{msg.text}</div>
              <div className="chatMessageTimestamp">{msg.timestamp}</div>
            </div>
          </div>
        ))}
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


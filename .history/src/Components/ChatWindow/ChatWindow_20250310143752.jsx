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

// src/components/ChatWindow/ChatWindow.scss
.chatWindow {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  position: relative;
  
  .chatHeader {
    padding: 16px;
    border-bottom: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .chatContactInfo {
      display: flex;
      align-items: center;
      
      .chatAvatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
      }
      
      h2 {
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .chatMoreButton {
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
      color: #8a8a8a;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background-color: #2a2a2a;
      }
    }
  }
  
  .chatMessagesContainer {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background-color: #1a1a1a;
    display: flex;
    flex-direction: column;
    
    .chatMessage {
      max-width: 80%;
      margin-bottom: 16px;
      display: flex;
      
      &.chatMessageUser {
        align-self: flex-end;
        flex-direction: row-reverse;
        
        .chatMessageContent {
          background-color: #0084ff;
          border-radius: 18px 4px 18px 18px;
          
          .chatMessageTimestamp {
            text-align: right;
          }
        }
      }
      
      &.chatMessageContact {
        align-self: flex-start;
        
        .chatMessageContent {
          background-color: #333;
          border-radius: 4px 18px 18px 18px;
        }
        
        .chatMessageAvatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
      
      .chatMessageContent {
        padding: 10px 14px;
        
        .chatMessageText {
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .chatMessageTimestamp {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
  
  .chatInputContainer {
    padding: 12px 16px;
    background-color: #121212;
    border-top: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    position: relative;
    
    .chatMessageActions {
      display: flex;
      margin-right: 10px;
      position: relative;
      
      button {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        color: #8a8a8a;
        margin-right: 8px;
        padding: 4px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background-color: #2a2a2a;
        }
      }
      
      .chatEmojiPickerContainer {
        position: absolute;
        bottom: 50px;
        left: 0;
        z-index: 10;
      }
    }
    
    input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 14px;
      
      &::placeholder {
        color: #8a8a8a;
      }
    }
    
    .chatSendButton {
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
      color: #0084ff;
      margin-left: 10px;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background-color: #2a2a2a;
      }
    }
  }
}
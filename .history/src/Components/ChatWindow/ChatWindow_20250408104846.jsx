import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.scss";
import { Send, ArrowLeft } from "react-feather";
import { database, ref, onValue, push, set, serverTimestamp } from "../../Server/Firebase";

const ChatWindow = ({ contact, currentUser, isOpen, toggleWindow }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when the contact or chat ID changes
  useEffect(() => {
    if (!contact || !contact.chatId || !currentUser) return;

    const messagesRef = ref(database, `chats/${contact.chatId}/messages`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
          isMe: msg.senderId === currentUser.userId
        }));
        
        // Sort messages by timestamp
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [contact, currentUser]);

  const handleSendMessage = async () => {
    if (!message.trim() || !contact || !contact.chatId || !currentUser) return;

    try {
      const newMessageRef = push(ref(database, `chats/${contact.chatId}/messages`));
      
      await set(newMessageRef, {
        text: message.trim(),
        senderId: currentUser.userId,
        senderName: currentUser.fullName || "User",
        timestamp: Date.now(),
        read: false
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chatWindow ${isOpen ? "isOpen" : ""}`}>
      <div className="chatHeader">
        <button className="backButton" onClick={toggleWindow}>
          <ArrowLeft size={20} />
        </button>
        <div className="contactInfo">
          <img 
            src={contact?.avatar || "https://via.placeholder.com/40"} 
            alt={contact?.name} 
            className="contactAvatar" 
          />
          <div className="contactName">{contact?.name}</div>
        </div>
      </div>

      <div className="messagesContainer">
        {messages.length === 0 ? (
          <div className="noMessagesPlaceholder">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`messageItem ${msg.isMe ? "sentMessage" : "receivedMessage"}`}
            >
              <div className="messageContent">
                <div className="messageText">{msg.text}</div>
                <div className="messageTime">{formatTimestamp(msg.timestamp)}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="messageInputContainer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="messageInput"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button 
          className="sendButton" 
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
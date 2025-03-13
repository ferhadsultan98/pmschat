import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, MoreHorizontal } from "react-feather";
import { RiArrowDownSLine } from "react-icons/ri";

import EmojiPicker from "emoji-picker-react";
import "./ChatWindow.scss";
import FileModal from "./ChatFileModal/FileModal";
import {
  database,
  ref,
  push,
  update,
  onValue,
  serverTimestamp,
} from "../../Server/Firebase";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Sending...";

  const now = new Date();
  const messageDate = new Date(timestamp);

  const isSameDay = now.toDateString() === messageDate.toDateString();
  const diffInMs = now - messageDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const timeStr = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isSameDay) {
    return `Today ${timeStr}`;
  }
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 7) {
    const dayName = messageDate.toLocaleDateString("en-US", { weekday: "long" });
    return `${dayName} ${timeStr}`;
  }
  return messageDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ChatWindow = ({ contact, currentUser }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const messageEndRef = useRef(null);

  const getChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_"); // Unique chat ID
  };

  useEffect(() => {
    if (!contact?.id || !currentUser?.userId) return;

    const chatId = getChatId(currentUser.userId, contact.id);
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
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
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    return () => unsubscribe();
  }, [contact?.id, currentUser?.userId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !contact?.id || !currentUser?.userId) return;

    const chatId = getChatId(currentUser.userId, contact.id);
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const senderRef = ref(database, `users/${currentUser.userId}`);
    const receiverRef = ref(database, `users/${contact.id}`);

    const newMessage = {
      senderId: currentUser.userId,
      receiverId: contact.id,
      text: message.trim(),
      timestamp: serverTimestamp(),
    };

    push(messagesRef, newMessage)
      .then(() => {
        const lastMessageUpdate = {
          lastMessage: message.trim(),
          timestamp: serverTimestamp(),
        };
        update(senderRef, lastMessageUpdate);
        update(receiverRef, lastMessageUpdate);
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Failed to send message.");
      });
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (!contact) {
    return (
      <div className="chatWindow chatWindowNoContact">
        <div className="chatHeader">
          <h3>Please choose a contact to start chatting...</h3>
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
              className={`chatMessage ${
                msg.senderId === currentUser.userId
                  ? "chatMessageUser"
                  : "chatMessageContact"
              }`}
            >
              {msg.senderId !== currentUser.userId && (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="chatMessageAvatar"
                />
              )}
              <div className="chatMessageContent">
              <i><RiArrowDownSLine /></i>

                <div className="chatMessageText">{msg.text}</div>
                <div className="chatMessageTimestamp">
                  {formatTimestamp(msg.timestamp)}
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
          <button
            type="button"
            className="chatAttachmentButton"
            onClick={() => setShowFileModal(true)}
          >
            <Paperclip size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Message ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="chatSendButton">
          <Send size={24} />
        </button>
      </form>

      {showFileModal && <FileModal onClose={() => setShowFileModal(false)} />}
    </div>
  );
};

export default ChatWindow;
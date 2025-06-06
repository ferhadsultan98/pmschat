import React, { useState, useRef, useEffect } from "react";
import { Smile, Send, MoreHorizontal } from "react-feather";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import "./ChatWindow.scss";
import {
  database,
  ref,
  push,
  update,
  onValue,
  serverTimestamp,
} from "../../Server/Firebase";
import { FaRegArrowAltCircleDown } from "react-icons/fa";

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
  if (isSameDay) return timeStr;
  if (diffInDays === 1) return `Yesterday ${timeStr}`;
  if (diffInDays < 7) {
    const dayName = messageDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return `${dayName} ${timeStr}`;
  }
  return `${messageDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} ${timeStr}`;
};

const ChatWindow = ({ contact, currentUser, isOpen, toggleWindow }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageEndRef = useRef(null);

  const getChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };

  const scrollToBottom = () => {
    const container = messageEndRef.current?.parentElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
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

        setTimeout(() => scrollToBottom(), 0);
      },
      (error) => {
        // console.error("Error fetching messages:", error);
      }
    );

    setTimeout(() => scrollToBottom(), 0);

    return () => unsubscribe();
  }, [contact?.id, currentUser?.userId]);

  useEffect(() => {
    const container = messageEndRef.current?.parentElement;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollButton(distanceFromBottom > 50);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages]);

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
        // console.error("Error sending message:", error);
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
    <div className={`chatWindow ${isOpen ? "isOpen" : ""}`}>
      <div className="chatHeader">
        <div className="chatContactInfo">
          <div
            className="backChat"
            onClick={toggleWindow}
            style={{ display: isOpen ? "flex" : "none" }}
          >
            <IoIosArrowBack size={28} />
          </div>
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
                <span className="messageDecor"></span>
                <div className="chatMessageText">{msg.text}</div>
                <div className="chatMessageTimestamp">
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="noMessages">No messages</div>
        )}
        <div ref={messageEndRef} />
        <div className="getScrollDown" onClick={scrollToBottom}>
          <IoIosArrowDown />
        </div>
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
    </div>
  );
};

export default ChatWindow;

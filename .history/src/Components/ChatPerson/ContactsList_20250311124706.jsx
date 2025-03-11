import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, MoreHorizontal } from "react-feather";
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

// Timestamp formatting function
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Gönderiliyor...";

  const now = new Date();
  const messageDate = new Date(timestamp);

  // Tarihleri sadece gün-ay-yıl olarak karşılaştır
  const isSameDay = now.toDateString() === messageDate.toDateString();
  const diffInMs = now - messageDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const timeStr = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isSameDay) {
    return `Today ${timeStr}`; // e.g., "Today 10:22"
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    const dayName = messageDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    return `${dayName} ${timeStr}`; // e.g., "Wednesday 22:11"
  }

  return messageDate
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/"); // e.g., "10/03/2025"
};

const ChatWindow = ({ contact, onFileButtonClick }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!contact?.id) return;

    const messagesRef = ref(database, `contacts/${contact.id}/messages`);
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
  }, [contact?.id]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !contact?.id) return;

    const messagesRef = ref(database, `contacts/${contact.id}/messages`);
    const contactRef = ref(database, `contacts/${contact.id}`);

    const newMessage = {
      sender: "user",
      text: message.trim(),
      timestamp: serverTimestamp(), // Firebase sunucu zaman damgası
    };

    push(messagesRef, newMessage)
      .then(() => {
        update(contactRef, {
          lastMessage: message.trim(),
          timestamp: serverTimestamp(),
        });
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("Mesaj gönderilirken bir hata oluştu.");
      });
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

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
              className={`chatMessage ${
                msg.sender === "user" ? "chatMessageUser" : "chatMessageContact"
              }`}
            >
              {msg.sender === "contact" && (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="chatMessageAvatar"
                />
              )}
              <div className="chatMessageContent">
                <div className="chatMessageText">{msg.text}</div>
                <div className="chatMessageTimestamp">
                  {formatTimestamp(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="noMessages">Not message</div>
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
            onClick={onFileButtonClick}
          >
            <Paperclip size={24} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Message write ..."
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

ve burdada o yazisma baslasin
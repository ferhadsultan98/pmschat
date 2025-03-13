import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, MoreHorizontal } from "react-feather";
import { RiArrowDownSLine } from "react-icons/ri";
import { MdPlayArrow } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io"; // Import the back arrow icon
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

// ... (formatTimestamp function remains unchanged)

const ChatWindow = ({ contact, currentUser }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showFileModal, setShowFileModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const messageEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); // Controls the open/close state

  const toggleWindow = () => setIsOpen(!isOpen); // Toggle the isOpen state
  const getChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };

  // ... (useEffect and other functions remain unchanged)

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
          {/* Fixed backChat button */}
          <div
            className="backChat"
            onClick={toggleWindow} // Trigger toggleWindow on click
            style={{ display: isOpen ? "none" : "flex" }} // Show when isOpen is false
          >
            <IoIosArrowBack size={20} />
          </div>
          <img src={contact.avatar} alt={contact.name} className="chatAvatar" />
          <h2>{contact.name}</h2>
        </div>
        <button className="chatMoreButton">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Conditionally render the chat content based on isOpen */}
      {isOpen ? (
        <>
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
                    <div className="messageMoreMenuWrapper">
                      <i
                        className="messageMoreMenu"
                        onClick={() => toggleDropdown(msg.id)}
                      >
                        <RiArrowDownSLine />
                      </i>
                      {openDropdownId === msg.id && (
                        <div className="dropdownMenu">
                          <button
                            className="dropdownItem"
                            onClick={() => handleCopy(msg.text)}
                          >
                            Copy
                          </button>
                        </div>
                      )}
                    </div>

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
        </>
      ) : null}
    </div>
  );
};

export default ChatWindow;
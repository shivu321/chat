import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.trim()) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-2 bg-dark rounded gap-2">
      {/* Emoji Picker */}
      <div className="position-relative">
        <BsEmojiSmileFill
          className="text-warning fs-3 cursor-pointer"
          onClick={toggleEmojiPicker}
        />
        {showEmojiPicker && (
          <div
            className="position-absolute"
            style={{ bottom: "60px", left: 0, zIndex: 1000 }}
          >
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Input + Send */}
      <form className="d-flex flex-grow-1" onSubmit={sendChat}>
        <input
          type="text"
          className="form-control bg-secondary text-white border-0 rounded-pill me-2"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          type="submit"
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const { data: messagesData } = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(messagesData);
    };
    fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    socket.current.emit("send-msg", { to: currentChat._id, from: data._id, msg });
    await axios.post(sendMessageRoute, { from: data._id, to: currentChat._id, message: msg });
    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  };

  // Receive message
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => setArrivalMessage({ fromSelf: false, message: msg }));
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-primary text-light">
        <div className="d-flex align-items-center">
          <img
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt="avatar"
            className="rounded-circle me-2"
            style={{ width: 50, height: 50, border: "2px solid #fff" }}
          />
          <h5 className="mb-0">{currentChat.username}</h5>
        </div>
        <Logout />
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto p-2 bg-dark">
        {messages.map((message) => (
          <div
            key={uuidv4()}
            ref={scrollRef}
            className={`d-flex mb-2 ${message.fromSelf ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className="p-2 rounded-3"
              style={{
                maxWidth: "65%",
                backgroundColor: message.fromSelf ? "#4e0eff" : "#fff",
                color: message.fromSelf ? "#fff" : "#000",
                wordBreak: "break-word",
              }}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 border-top bg-secondary">
        <ChatInput handleSendMsg={handleSendMsg} />
      </div>
    </div>
  );
}

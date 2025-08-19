import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    console.log("current Chat :" ,currentChat);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!storedUser) navigate("/login");
      else setCurrentUser(JSON.parse(storedUser));
    };
    checkUser();
  }, [navigate]);

  // Connect socket
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else navigate("/setAvatar");
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    if (isMobile) setShowChat(true);
  };

  return (
    <div className="container-fluid vh-100 bg-dark text-light p-0">
      <div className="row h-100 g-0">
        {/* Contacts (Left or default mobile) */}
        {(!isMobile || !showChat) && (
          <div className={`col-md-3 col-12 border-end d-flex flex-column`}>
            <div className="bg-secondary text-center fw-bold p-2">Contacts</div>
            <Contacts contacts={contacts} changeChat={handleChatChange} />
          </div>
        )}

        {/* Chat Section (Right or mobile after selecting chat) */}
        {(!isMobile || showChat) && (
          <div className="col-md-9 col-12 d-flex flex-column">
            {isMobile && (
              <div className="bg-secondary p-2">
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setShowChat(false)}
                >
                  ⬅ Back
                </button>
              </div>
            )}
            <div className="flex-grow-1">
              {currentChat ? (
                <ChatContainer currentChat={currentChat} socket={socket} />
              ) : (
                <Welcome />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/talkative-logo.svg";
import io from "socket.io-client";

export default function Contacts({ contacts, changeChat }) {
  const socket = io("http://localhost:5000");
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [showChat, setShowChat] = useState(false); // mobile toggle

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    if (data) {
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    }
    // Listen to online users update
    socket.on("update-online-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    setShowChat(true); // mobile
  };

  const backToContacts = () => setShowChat(false);

  return (
    <>
      {currentUserImage && currentUserName && (
        <div className="container-fluid h-100 p-0">
          <div className="row h-100">
            {/* Sidebar / Contact List */}
            <div
              className={`col-md-12 col-12 d-flex flex-column bg-white text-light ${
                showChat ? "d-none d-md-flex" : ""
              }`}
            >
              <div className="d-flex align-items-center p-3 border-bottom">
                <img src={Logo} alt="logo" style={{ height: "40px" }} />
              </div>

              <div className="flex-grow-1 overflow-auto">
                {contacts.map((contact, index) => {
                  const isOnline = onlineUsers.includes(contact._id);
                  return (
                    <div
                      key={contact._id}
                      className={` pt-2 d-flex align-items-center p-2 border-bottom cursor-pointer rounded-3 mx-3 ${
                        index === currentSelected ? "bg-primary" : ""
                      }`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="position-relative">
                        <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt="avatar"
                          className="rounded-circle"
                          style={{ width: "50px", height: "50px" }}
                        />
                        <span
                          className={`position-absolute bottom-0 end-0 rounded-circle border border-dark ${
                            isOnline ? "bg-success" : "bg-secondary"
                          }`}
                          style={{ width: "12px", height: "12px" }}
                        ></span>
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-0 text-dark">{contact.username}</h6>
                        <small className="text-muted">
                          {isOnline
                            ? "Online"
                            : contact.lastOnline
                            ? `Last seen: ${new Date(
                                contact.lastOnline
                              ).toLocaleString()}`
                            : "Offline"}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current User */}
              <div className="d-flex align-items-center p-3 border-top">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
                <span className="ms-2 text-dark">{currentUserName}</span>
              </div>
            </div>

            {/* Chat Area */}
          </div>
        </div>
      )}
    </>
  );
}

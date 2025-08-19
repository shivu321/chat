import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/talkative-logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
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
                <h5 className="ms-2 mb-0">Talkative</h5>
              </div>

              <div className="flex-grow-1 overflow-auto">
                {contacts.map((contact, index) => (
                  <div
                    key={contact._id}
                    className={`d-flex align-items-center p-2 border-bottom cursor-pointer rounded-3 mx-3 ${
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
                          contact.isOnline ? "bg-success" : "bg-secondary"
                        }`}
                        style={{ width: "12px", height: "12px" }}
                      ></span>
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-0">{contact.username}</h6>
                      <small className="text-muted">
                        {contact.lastMessage || "Tap to chat..."}
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current User */}
              <div className="d-flex align-items-center p-3 border-top">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
                <span className="ms-2">{currentUserName}</span>
              </div>
            </div>

            {/* Chat Area */}
          </div>
        </div>
      )}
    </>
  );
}

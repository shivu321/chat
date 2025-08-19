import React, { useState, useEffect } from "react";
import Robot from "../assets/robot.gif";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      if (storedUser?.username) {
        setUserName(storedUser.username);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center bg-dark p-3">
      <div className="text-center text-white">
        <img
          src={Robot}
          alt="robot"
          className="img-fluid mb-3"
          style={{ maxHeight: "18rem" }}
        />
        <h1 className="mb-2 fs-2">
          Welcome, <span className="text-primary">{userName}!</span>
        </h1>
        <h3 className="fs-5 text-secondary">
          Please select a chat to start messaging.
        </h3>
      </div>
    </div>
  );
}

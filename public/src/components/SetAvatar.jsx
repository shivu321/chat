import React, { useEffect, useState } from "react";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (!user) navigate("/login");
  }, [navigate]);

  const generateRandomName = () => Math.random().toString(36).substring(2, 10);

  useEffect(() => {
    const generateAvatars = () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const randomName = generateRandomName();
        const svgCode = multiavatar(randomName);
        const encoded = btoa(unescape(encodeURIComponent(svgCode)));
        data.push(encoded);
      }
      setAvatars(data);
      setIsLoading(false);
    };

    generateAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("⚠ Please select an avatar", toastOptions);
      return;
    }

    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    try {
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("❌ Error setting avatar. Try again!", toastOptions);
      }
    } catch (err) {
      toast.error("🚨 Something went wrong!", toastOptions);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
          <img src={loader} alt="loader" className="img-fluid" style={{ maxWidth: "150px" }} />
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark p-3">
          <div className="text-center mb-4">
            <h1 className="text-white fs-3">
              Pick an Avatar as your profile picture
            </h1>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`d-flex justify-content-center align-items-center rounded-circle p-2 bg-secondary ${
                  selectedAvatar === index ? "border border-4 border-primary shadow" : ""
                }`}
                style={{ cursor: "pointer", transition: "0.3s" }}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt={`avatar-${index}`}
                  className="img-fluid rounded-circle"
                  style={{ width: "5rem", height: "5rem", transition: "0.3s" }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="btn btn-primary btn-lg text-uppercase"
          >
            Set as Profile Picture
          </button>
          <ToastContainer />
        </div>
      )}
    </>
  );
}

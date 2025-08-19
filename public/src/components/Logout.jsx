import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY) || "{}"
    )._id;
    if (!id) return;

    const { status } = await axios.get(`${logoutRoute}/${id}`);
    if (status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem;
  border-radius: 0.6rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  svg {
    font-size: 1.4rem;
    color: #ebe7ff;
  }

  &:hover {
    background-color: #7d6bf0;
    transform: scale(1.05);
  }

  /* 🔹 Responsive adjustments */
  @media screen and (max-width: 768px) {
    padding: 0.5rem;
    svg {
      font-size: 1.2rem;
    }
  }

  @media screen and (max-width: 480px) {
    padding: 0.4rem;
    border-radius: 0.4rem;
    svg {
      font-size: 1rem;
    }
  }
`;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/talkative-logo.svg";
import DummyImage from "../assets/chat_animation.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, { username, password });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="container-fluid vh-100">
        <div className="row h-100">
          {/* Left side - Image (hidden on mobile) */}
          <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center bg-white">
            <img
              src={DummyImage}
              alt="dummy"
              className="img-fluid rounded w-75"
            />
          </div>

          {/* Right side - Form (full width on mobile) */}
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center bg-light">
            <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
              <form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <img src={Logo} alt="logo" height="50" className="mb-2" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                  min="3"
                  className="form-control mb-3"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  className="form-control mb-3"
                />
                <button type="submit" className="btn btn-primary w-100">
                  Log In
                </button>
                <div className="text-center mt-3">
                  <span>
                    Don&apos;t have an account ?{" "}
                    <Link to="/register" className="fw-bold text-decoration-none">
                      Create One
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import Logo from "../assets/talkative-logo.svg";
import DummyImage from "../assets/chat_animation.svg"; // left side image
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters.", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

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
    <div className="vh-100 d-flex align-items-center bg-dark">
      <Container fluid className="px-0">
        <Row className="g-0 h-100 shadow-lg">
          {/* Left Side (Image / Animation) */}
          <Col
            md={6}
            className="d-none d-md-flex align-items-center justify-content-center bg-light"
          >
            <img
              src={DummyImage}
              alt="dummy illustration"
              className="img-fluid p-4"
              style={{ maxHeight: "80%", objectFit: "contain" }}
            />
          </Col>

          {/* Right Side (Form in Card) */}
          <Col
            xs={12}
            md={6}
            className="bg-white d-flex align-items-center justify-content-center"
          >
            <Card className="w-100 border-0 p-4" style={{ maxWidth: "480px" }}>
              <div className="text-center mb-3">
                <img src={Logo} alt="logo" height="50" className="mb-2" />
                <h2 className="fw-bold text-primary fs-3">Create Account</h2>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="fw-semibold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted small">
                    Must be at least 8 characters.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label className="fw-semibold">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button type="submit" variant="primary" size="lg">
                    Create Account
                  </Button>
                </div>

                <p className="text-center text-muted small mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none"
                  >
                    Login here
                  </Link>
                </p>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
}

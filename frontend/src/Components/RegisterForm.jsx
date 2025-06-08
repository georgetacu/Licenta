import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function RegisterModal({ show, handleClose, setUser }) {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(""); // Default to regular user

  const handleRegister = () => {
    axios
      .post("http://localhost/Licenta/backend/auth.php", {
        action: "register",
        firstname,
        lastname,
        email,
        password,
        mobile,
        type
      })
      .then((response) => {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        alert("Registration successful!");
        handleClose();
      })
      .catch((error) => {
        alert(error.response?.data?.error || "Registration failed.");
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="registerFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="registerLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="registerEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="registerMobile" className="mt-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="registerPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="registerType" className="mt-3">
            <Form.Label>Account Type</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(Number(e.target.value))}
            >
              <option value={1}>Utilizator</option>
              <option value={2}>Detinator</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleRegister}>
          Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
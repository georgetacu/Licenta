// components/LoginForm.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function LoginForm({ show, handleClose, onSuccess,setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = () => {
    axios.post('http://localhost/Licenta/backend/auth.php', {
      action: 'login',
      email,
      password
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      const user = response.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      handleClose();
    })
    .catch(error => {
      alert(error.response?.data?.error || "Login failed.");
    });
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="loginEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="loginPassword" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleLogin}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
}

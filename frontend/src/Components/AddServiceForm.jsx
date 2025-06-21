
import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddServiceForm({ show, handleClose, user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost/Licenta/backend/addService.php", {
        name,
        description,
        price,
        user_id: user.id,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Service added successfully!");
      handleClose();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add service.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Service</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit}>Add Service</Button>
      </Modal.Footer>
    </Modal>
  );
}

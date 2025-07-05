import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddAutoServiceForm({ show, handleClose, user }) {
  const [form, setForm] = useState({
    name: "",
    vat: "",
    company_name: "",
    county: "",
    town: "",
    street: "",
    number: "",
    working_hours: "" // 👈 Added here
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, user_id: user.id };

      const response = await axios.post("http://localhost/Licenta/backend/addAutoService.php", payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Auto service added successfully!");
      handleClose();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add auto service.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Adauga Service Auto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nume Service</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Nume Companie</Form.Label>
            <Form.Control name="company_name" value={form.company_name} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>CUI</Form.Label>
            <Form.Control name="vat" value={form.vat} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Judet</Form.Label>
            <Form.Control name="county" value={form.county} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Oras</Form.Label>
            <Form.Control name="town" value={form.town} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Strada</Form.Label>
            <Form.Control name="street" value={form.street} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Numar Strada</Form.Label>
            <Form.Control name="number" value={form.number} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Anuleaza</Button>
        <Button variant="success" onClick={handleSubmit}>Adauga Service</Button>
      </Modal.Footer>
    </Modal>
  );
}

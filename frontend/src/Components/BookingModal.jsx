// BookingModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";


export default function BookingModal({ show, handleClose, onBook, autoServiceId }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [availableHours, setAvailableHours] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const services = Array.isArray(availableServices) ? availableServices : [];

  console.log("availableServices in BookingModal:", availableServices);

useEffect(() => {
  if (!autoServiceId) return;

  axios.post("http://localhost/Licenta/backend/getServicesByAutoService.php", {
    auto_service_id: autoServiceId,
  }, {
    headers: { "Content-Type": "application/json" }
  })
  .then(res => {
    const data = res.data;
    let servicesArray = [];

    if (Array.isArray(data)) {
      servicesArray = data;
    } else if (data && Array.isArray(data.services)) {
      servicesArray = data.services;
    }

    setAvailableServices(servicesArray);

    // Reset selectedServiceId only if it's not in the new services list
    if (!servicesArray.some(s => s.id === selectedServiceId)) {
      setSelectedServiceId("");
    }
  })
  .catch(err => {
    console.error("Failed to fetch services", err);
    setAvailableServices([]);
  });
}, [autoServiceId]);



  useEffect(() => {
    if (selectedDate) {
      generateAvailableHours(selectedDate);
      setSelectedHour(""); // reset selected hour when date changes
    } else {
      setAvailableHours([]);
      setSelectedHour("");
    }
  }, [selectedDate]);

  const generateAvailableHours = (dateStr) => {
    const hours = [];
    const now = new Date();
    const selected = new Date(dateStr);

    for (let h = 9; h <= 18; h++) {
      const timeSlot = new Date(selected);
      timeSlot.setHours(h, 0, 0, 0);

      if (timeSlot > now) {
        hours.push(`${String(h).padStart(2, "0")}:00`);
      }
    }

    setAvailableHours(hours);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedHour || !selectedServiceId) {
      alert("Please select date, time, and service.");
      return;
    }

    onBook({
      date: selectedDate,
      hour: selectedHour,
      service_id: selectedServiceId,
    });

    // Do NOT call handleClose here; let parent close modal on success
  };

  return (
    
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book an Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Date Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>

          {/* Hour Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Select Hour</Form.Label>
            <Form.Select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              disabled={!selectedDate || availableHours.length === 0}
            >
              <option value="">-- Select Hour --</option>
              {availableHours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Service Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Select Service</Form.Label>
            <Form.Select
  value={selectedServiceId}
  onChange={(e) => setSelectedServiceId(e.target.value)}
  disabled={availableServices.length === 0}
>
  <option value="">
    {availableServices.length === 0 ? "-- No services available --" : "-- Select Service --"}
  </option>
  {availableServices.map((service) => (
    <option key={service.id} value={service.id}>
      {service.title}
    </option>
  ))}
</Form.Select>

          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleBooking}
          disabled={!selectedDate || !selectedHour || !selectedServiceId}
        >
          Book
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

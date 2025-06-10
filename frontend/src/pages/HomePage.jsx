// HomePage.jsx
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from "../Components/LoginForm";
import RegisterModal from "../Components/RegisterForm";
import AddServiceForm from '../Components/AddServiceForm';
import AddAutoServiceForm from '../Components/AddAutoServiceForm';
import DisplayAutoServices from '../Components/DisplayAutoServices';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddAutoService, setShowAddAutoService] = useState(false);
  const navigate = useNavigate();

  // States for booking
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Loaded user:", parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleConfirmAppointment = () => {
    if (!appointmentDate) {
      alert("Please select a date and time.");
      return;
    }
    if (!selectedService) {
      alert("No service selected.");
      return;
    }

    const payload = {
      user_id: user.id,
      auto_service_id: selectedService.id,
      appointment_datetime: appointmentDate.toISOString()
    };

    axios.post("http://localhost/Licenta/backend/bookAppointment.php", payload)
      .then(() => {
        alert("✅ Appointment booked successfully!");
        setShowBookingModal(false);
        setSelectedService(null);
        setAppointmentDate(new Date());
      })
      .catch(err => {
        console.error("Booking failed:", err);
        alert("❌ Failed to book appointment. Please try again.");
      });
  };

  return (
    <div className="min-vh-100 bg-light">
      <header className="p-3 bg-dark text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
              <strong className="fs-4">AutoService</strong>
            </a>
            <div className="text-end d-flex align-items-center">
              {user ? (
                <>
                  <span className="me-3">
                    Welcome, {user.first_name} ({user.type === 1 ? "User" : user.type === 2 ? "Owner" : "Admin"})!
                  </span>

                  {user.type === 2 && (
                    <>
                      <button
                        className="btn btn-outline-info me-2"
                        onClick={() => setShowAddAutoService(true)}
                      >
                        Add Auto Service
                      </button>
                      <button
                        onClick={() => navigate('/manage-services')}
                        className="btn btn-outline-primary me-2"
                      >
                        Manage Services
                      </button>
                    </>
                  )}
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-light me-2" onClick={() => setShowLogin(true)}>
                    Login
                  </button>
                  <button className="btn btn-warning" onClick={() => setShowRegister(true)}>
                    Sign-up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="text-center py-5 container">
        <h1 className="display-4 mb-3">Welcome to Expert Auto</h1>
        <p className="lead mb-5">
          Explore our services and book your next appointment online with ease.
        </p>

        <DisplayAutoServices
          user={user}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          showBookingModal={showBookingModal}
          setShowBookingModal={setShowBookingModal}
        />
      </section>

      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} setUser={setUser} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} setUser={setUser} />
      <AddServiceForm show={showAddService} handleClose={() => setShowAddService(false)} user={user} />
      <AddAutoServiceForm show={showAddAutoService} handleClose={() => setShowAddAutoService(false)} user={user} />

      {/* Booking Modal controlled from HomePage */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Service:</strong> {selectedService?.name || 'None selected'}</p>
          <Form.Group>
            <Form.Label>Select Date & Time</Form.Label>
            <DatePicker
              selected={appointmentDate}
              onChange={date => setAppointmentDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmAppointment}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

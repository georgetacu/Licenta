// App.jsx
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from "./Components/LoginForm";
import RegisterModal from "./Components/RegisterForm";
import AddServiceForm from './Components/AddServiceForm';
import AddAutoServiceForm from './Components/AddAutoServiceForm';
import DisplayAutoServices from './Components/DisplayAutoServices';
import ManageServices from './Components/ManageServices';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddAutoService, setShowAddAutoService] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  const handleConfirmAppointment = () => {
    if (!user || !selectedService) {
      alert("You must be logged in and select a service.");
      return;
    }

    axios.post("http://localhost/Licenta/backend/bookAppointment.php", {
      user_id: user.id,
      auto_service_id: selectedService.id,
      appointment_datetime: appointmentDate.toISOString()
    })
      .then(() => {
        alert("✅ Appointment booked successfully!");
        setShowBookingModal(false);
      })
      .catch(err => {
        console.error("Booking failed:", err);
        alert("❌ Failed to book appointment. Please try again.");
      });
  };

  return (
    <div className="min-vh-100 bg-light d-flex">
      {/* Sidebar */}
      {user && (
        <div className="bg-dark text-white p-3" style={{ width: '220px', minHeight: '100vh' }}>
          <h5 className="mb-4">User Panel</h5>
          <ul className="nav nav-pills flex-column mb-auto">
            {user.type === 1 && (
              <li className="nav-item mb-2">
                <button className="btn btn-outline-light w-100" onClick={() => navigate('/my-appointments')}>
                  My Appointments
                </button>
              </li>
            )}
            {user.type === 2 && (
              <>
                <li className="nav-item mb-2">
                  <button className="btn btn-outline-light w-100" onClick={() => setShowAddAutoService(true)}>
                    Add Auto Service
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-outline-info w-100" onClick={() => navigate('/manage-services')}>
                    Manage Services
                  </button>
                </li>
              </>
            )}
            {user.type === 3 && (
              <>
                <li className="nav-item mb-2">
                  <button className="btn btn-outline-warning w-100" onClick={() => navigate('/owner-approvals')}>
                    Owner Approvals
                  </button>
                </li>
                <li className="nav-item mb-2">
                  <button className="btn btn-outline-success w-100" onClick={() => navigate('/auto-services-approvals')}>
                    Auto Services Approvals
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Main content */}
      <div className="flex-grow-1">
        <header className="p-3 bg-dark text-white">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                <strong className="fs-4">Expert Auto</strong>
              </a>
              <div className="text-end d-flex align-items-center">
                {user ? (
                  <>
                    <span className="me-3">
                      Welcome, {user.first_name} ({user.type === 1 ? "User" : user.type === 2 ? "Owner" : "Admin"})!
                    </span>
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

        <Routes>
          <Route
            path="/"
            element={
              <section className="text-center py-5 container">
                <h1 className="display-4 mb-3">Welcome to Expert Auto</h1>
                <p className="lead mb-5">Explore our services and book your next appointment online with ease.</p>
                <DisplayAutoServices
                  user={user}
                  setSelectedService={setSelectedService}
                  setShowBookingModal={setShowBookingModal}
                />
              </section>
            }
          />
          <Route path="/manage-services" element={<ManageServices user={user} />} />
        </Routes>
      </div>

      {/* Modals */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} setUser={setUser} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} setUser={setUser} />
      <AddServiceForm show={showAddService} handleClose={() => setShowAddService(false)} user={user} />
      <AddAutoServiceForm show={showAddAutoService} handleClose={() => setShowAddAutoService(false)} user={user} />

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Service:</strong> {selectedService?.name}</p>
          <Form.Group>
            <Form.Label>Select Date & Time</Form.Label>
            <DatePicker
              selected={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
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

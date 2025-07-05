// App.jsx
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import LoginModal from "./Components/LoginForm";
import RegisterModal from "./Components/RegisterForm";
import AddServiceForm from './Components/AddServiceForm';
import AddAutoServiceForm from './Components/AddAutoServiceForm';
import DisplayAutoServices from './Components/DisplayAutoServices';
import ManageServices from './Components/ManageServices';
import BookingModal from './Components/BookingModal';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyAppointments from './Components/MyAppointments';
import MyReviews from './Components/MyReviews';
import OwnerAppointments from './Components/OwnerAppointments';
import CalendarPanel from "./Components/CalendarPanel";
import UserReviews from "./Components/UserReviews";
import OwnerApprovals from "./Components/OwnerApprovals";
import Accounts from "./Components/Accounts";
import AboutPage from "./Components/AboutPage";
import Settings from "./Components/Settings";
import AdminDashboard from "./Components/AdminDashboard";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddAutoService, setShowAddAutoService] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [collapsed, setCollapsed] = useState(false);


const handleBookingConfirm = ({ date, hour, service_id }) => {
  console.log("BookingConfirm received:", { date, hour, service_id });

  if (!user) {
    alert("Trebuie sa fii logat pentru a efectua o programare.");
    return;
  }

  // Create a Date object from the selected date
  const appointmentDateTime = new Date(date);

  // Extract hours and minutes from the `hour` string (e.g. "14:00")
  const [h, m] = hour.split(":");

  appointmentDateTime.setHours(parseInt(h), parseInt(m), 0, 0);

  axios.post("http://localhost/Licenta/backend/bookAppointment.php", {
    user_id: user.id,
    auto_service_id: selectedService.id,
    service_id: service_id,
    appointment_datetime: appointmentDateTime.toISOString(),
  }, {
    headers: { "Content-Type": "application/json" },
  })
  .then(() => {
    toast.success("Programarea efectuata cu succes!");
    setShowBookingModal(false);
  })
  .catch((err) => {
    console.error("Booking failed:", err);
    toast.error("Nu a putut fi efectuata programarea. Reincercati.");
  });
};



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

  

  // Generate available hours for selected date
  const generateAvailableHours = (dateStr) => {
    const hours = [];
    const now = new Date();
    const selected = new Date(dateStr);

    for (let h = 9; h <= 18; h++) {
      const slot = new Date(selected);
      slot.setHours(h, 0, 0, 0);

      if (slot > now) {
        hours.push(`${String(h).padStart(2, "0")}:00`);
      }
    }
    return hours;
  };

  useEffect(() => {
    if (selectedDate) {
      setAvailableHours(generateAvailableHours(selectedDate));
      setSelectedHour(""); // Reset hour on date change
    }
  }, [selectedDate]);

  const handleConfirmAppointment = () => {
    if (!user || !selectedService) {
      alert("Trebuie sa fii logat pentru a efectua o programare.");
      return;
    }

    if (!selectedDate || !selectedHour) {
      alert("Te rugam sa selectezi data si ora.");
      return;
    }

    const [hour, minute] = selectedHour.split(":");
    const appointment = new Date(selectedDate);
    appointment.setHours(Number(hour), Number(minute), 0, 0);

    axios.post("http://localhost/Licenta/backend/bookAppointment.php", {
      user_id: user.id,
      auto_service_id: selectedService.id,
      appointment_datetime: appointment.toISOString()
    }, {
      headers: { "Content-Type": "application/json" }
    })
      .then(() => {
        alert("✅ Programare efectuata cu succes!");
        setShowBookingModal(false);
      })
      .catch(err => {
        console.error("Booking failed:", err);
        alert(" Nu a putut fi efectuata programarea. Reincercati.");
      });
  };

  const todayISO = new Date().toISOString().split("T")[0];

  return (
    <div className="min-vh-100 bg-light d-flex">
      {/* Sidebar */}
      {user && (
  <div
    className={`d-flex flex-column text-white bg-dark p-3 sidebar ${collapsed ? 'collapsed' : ''}`}
    style={{
      width: collapsed ? '80px' : '250px',
      minHeight: '100vh',
      transition: 'width 0.3s ease',
    }}
  >
  <div className="d-flex align-items-center mb-4 justify-content-between">
  {/* Logo on left (hide when collapsed) */}
  {!collapsed && (
    <img 
      src="/src/assets/ealogo2.jpg"
      alt="Logo"
      style={{ width: '40px', height: '40px' }}
    />
  )}

  {/* Collapse button on right */}
  <button
    className="btn btn-sm btn-outline-light"
    onClick={() => setCollapsed(!collapsed)}
  >
    <i className={`bi ${collapsed ? 'bi-arrow-right-circle' : 'bi-arrow-left-circle'}`}></i>
  </button>
</div>
  
    <ul className="nav nav-pills flex-column mb-auto">
       <>
          <li className="nav-item mb-2">
            <button
  className="btn btn-outline-light w-100 d-flex align-items-center"
  onClick={() => navigate("/")}
>
  <i className="bi bi-house me-2"></i>
  {!collapsed && "Acasa"}
</button>
          </li>
        </>
      {user?.type === 1 && (
        <>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/my-appointments')}>
              <i className="bi bi-calendar-check me-2"></i>
              {!collapsed && "Programarile mele"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/my-reviews')}>
              <i className="bi bi-chat-dots me-2"></i>
              {!collapsed && "Comentariile mele"}
            </button>
          </li>
        </>
      )}

      {user?.type === 2 && (
        <>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => setShowAddAutoService(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              {!collapsed && "Adauga Service Auto"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/manage-services')}>
              <i className="bi bi-wrench-adjustable me-2"></i>
              {!collapsed && "Service-uri Auto"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/owner-appointments')}>
              <i className="bi bi-calendar3 me-2"></i>
              {!collapsed && "Programari"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/calendar')}>
              <i className="bi bi-calendar-range me-2"></i>
              {!collapsed && "Calendar"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/user-reviews')}>
              <i className="bi bi-stars me-2"></i>
              {!collapsed && "Review-uri"}
            </button>
          </li>
          
        </>
      )}
      {user?.type === 4 && (
        <>
        
        </>
      )}

      {user?.type === 3 && (
        <>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/owner-approvals')}>
              <i className="bi bi-check-circle me-2"></i>
              {!collapsed && "Aprobari Owner"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/accounts')}>
              <i className="bi bi-people me-2"></i>
              {!collapsed && "Conturi"}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn btn-outline-light w-100 d-flex align-items-center" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-people me-2"></i>
              {!collapsed && "Panou de control"}
            </button>
          </li>
        </>
      )}
      <div style={{ marginTop: 'auto' }}>
    <li className="nav-item mb-2">
      <button
        className="btn btn-outline-light w-100 d-flex align-items-center"
        onClick={() => navigate('/about')}
      >
        <i className="bi bi-info-square me-2"></i>
        {!collapsed && 'Despre'}
      </button>
    </li>
    <li className="nav-item mb-2">
      <button
        className="btn btn-outline-light w-100 d-flex align-items-center"
        onClick={() => navigate('/settings')}
      >
        <i className="bi bi-gear me-2"></i>
        {!collapsed && 'Optiuni'}
      </button>
    </li>
  </div>

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
                <h1 className="display-4 mb-3">Bine ai venit pe platforma Expert Auto</h1>
                <p className="lead mb-5">Explorează serviciile noastre și programează-ți următoarea întâlnire online cu ușurință.</p>
                
                <DisplayAutoServices
                  user={user}
                  setSelectedService={setSelectedService}
                  setShowBookingModal={setShowBookingModal}
                />
              </section>
            }
          />
          <Route path="/manage-services" element={<ManageServices user={user} />} />
          <Route path="/my-appointments" element={<MyAppointments user={user} />} />
          <Route path="/my-reviews" element={<MyReviews user={user} />} />
          <Route path="/owner-appointments" element={<OwnerAppointments user={user} />} />
          <Route path="/calendar" element={<CalendarPanel user={user} />} />
          <Route path="/user-reviews" element={<UserReviews user={user} />} />
          <Route path="/owner-approvals" element={<OwnerApprovals />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/dashboard" element={<AdminDashboard user={user} />} />
        </Routes>
        

      </div>

      {/* Modals */}
      <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} setUser={setUser} />
      <RegisterModal show={showRegister} handleClose={() => setShowRegister(false)} setUser={setUser} />
      <AddServiceForm show={showAddService} handleClose={() => setShowAddService(false)} user={user} />
      <AddAutoServiceForm show={showAddAutoService} handleClose={() => setShowAddAutoService(false)} user={user} />

      <BookingModal
  show={showBookingModal}
  handleClose={() => setShowBookingModal(false)}
  autoServiceId={selectedService?.id}
  onBook={handleBookingConfirm}
  selectedServiceId={selectedServiceId}
  setSelectedServiceId={setSelectedServiceId}
/>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

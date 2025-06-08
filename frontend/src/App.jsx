import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginModal from "./Components/LoginForm";
import RegisterModal from "./Components/RegisterForm";
import AddServiceForm from './Components/AddServiceForm';
import AddAutoServiceForm from './Components/AddAutoServiceForm';


const services = [
  {
    title: "Oil Change",
    description: "Keep your engine running smoothly with regular oil changes.",
    icon: "🛢️"
  },
  {
    title: "Tire Rotation",
    description: "Extend the life of your tires with routine rotation.",
    icon: "🚗"
  },
  {
    title: "Brake Inspection",
    description: "Ensure your safety with regular brake system checks.",
    icon: "🛠️"
  },
  {
    title: "Battery Check",
    description: "Test and replace your car battery as needed.",
    icon: "🔋"
  }
];

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddAutoService, setShowAddAutoService] = useState(false);



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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

            {user?.type === 2 && (
  <button className="btn btn-outline-info me-2" onClick={() => setShowAddAutoService(true)}>
    Add Auto Service
  </button>
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

        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <div className="display-4 mb-3">{service.icon}</div>
                  <h5 className="card-title">{service.title}</h5>
                  <p className="card-text text-muted">{service.description}</p>
                  <button className="btn btn-primary mt-3">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LoginModal
  show={showLogin}
  handleClose={() => setShowLogin(false)}
  setUser={setUser}
/>
<RegisterModal                            
  show={showRegister}
  handleClose={() => setShowRegister(false)}
  setUser={setUser}
/>
<AddServiceForm show={showAddService} handleClose={() => setShowAddService(false)} user={user} />
  <AddAutoServiceForm show={showAddAutoService} handleClose={() => setShowAddAutoService(false)} user={user} />



    </div>
  );
}

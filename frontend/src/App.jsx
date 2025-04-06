import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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
  return (
    <div className="min-vh-100 bg-light">
      <header className="p-3 bg-dark text-white">
  <div className="container">
    <div className="d-flex flex-wrap align-items-center justify-content-between">
      <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
        <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"/></svg>
        <strong className="fs-4">AutoService</strong>
      </a>
      <div className="text-end">
        <a type="button" href="http://localhost/Licenta/frontend/src/index.php" className="btn btn-outline-light me-2">Login</a>
        <button type="button" className="btn btn-warning">Sign-up</button>
      </div>
    </div>
  </div>
</header>


      <section className="text-center py-5 container">
        <h1 className="display-4 mb-3">Welcome to Our Auto Service</h1>
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
    </div>
  );
}

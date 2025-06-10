// DisplayAutoServices.jsx
import React, { useEffect, useState } from 'react';

const DisplayAutoServices = ({
  user,
  selectedService,
  setSelectedService,
  showBookingModal,
  setShowBookingModal
}) => {
  const [autoServices, setAutoServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost/Licenta/backend/getAutoServices.php')
      .then(res => res.json())
      .then(data => {
        setAutoServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch auto services:', err);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (service) => {
    if (!user) {
      alert("You must be logged in to book an appointment.");
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading auto services...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3">
      <h2 className="text-center mb-4">Registered Auto Services</h2>
      {autoServices.length === 0 ? (
        <p className="text-center text-muted">No auto services found.</p>
      ) : (
        <div className="row g-3">
          {autoServices.map(service => (
            <div key={service.id} className="col-12">
              <div className="card shadow-sm border-0 w-100">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                  <div>
                    <h5 className="card-title mb-1">{service.name}</h5>
                    <p className="mb-0 text-muted">
                      {service.company_name && `${service.company_name} `}
                    </p>
                  </div>
                  <div className="text-md-end mt-3 mt-md-0">
                    <p className="mb-0">
                      {service.street} {service.number}, {service.town}, {service.county}
                    </p>
                    <small className="text-muted">
                      Added on: {new Date(service.created_at).toLocaleDateString()}
                    </small>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => handleBookClick(service)}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayAutoServices;

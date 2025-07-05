import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const DisplayAutoServices = ({
  user,
  selectedService,
  setSelectedService,
  showBookingModal,
  setShowBookingModal
}) => {
  const [autoServices, setAutoServices] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [serviceList, setServiceList] = useState({});

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");  // filter by service title
  const [addressFilter, setAddressFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");  // assuming rating is a number field

  // Fetch services and ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch auto services
        const resServices = await fetch('http://localhost/Licenta/backend/getAutoServices.php');
        const servicesData = await resServices.json();

        // Fetch ratings
        const resRatings = await fetch('http://localhost/Licenta/backend/getServiceRatings.php');
        const ratingsData = await resRatings.json();

        setAutoServices(servicesData);
        setRatings(ratingsData.ratings || {});
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Eroare la preluarea serviciilor sau rating-urilor.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookClick = (service) => {
    if (!user || user?.type !== 1) {
      toast.warn("Trebuie să fii autentificat ca utilizator pentru a face o programare.");
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleViewServices = async (serviceId) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
      return;
    }

    if (!serviceList[serviceId]) {
      try {
        const response = await fetch('http://localhost/Licenta/backend/getServicesByAutoService.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ auto_service_id: serviceId })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch services');
        }

        setServiceList(prev => ({ ...prev, [serviceId]: data }));
      } catch (err) {
        console.error(err);
        toast.error("Eroare la încarcarea serviciilor.");
      }
    }

    setExpandedServiceId(serviceId);
  };

  // Helper function to check if a service's services match the serviceFilter
  const serviceMatchesFilter = (service) => {
    if (!serviceFilter) return true;
    const servicesForThisAuto = serviceList[service.id] || [];
    return servicesForThisAuto.some(s =>
      s.title.toLowerCase().includes(serviceFilter.toLowerCase())
    );
  };

  // Filtered list based on all filters
  const filteredServices = autoServices.filter(service => {
    // Filter by name (searchTerm)
    if (!service.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    // Filter by address (check if any address field matches the filter)
    const fullAddress = `${service.street} ${service.number} ${service.town} ${service.county}`.toLowerCase();
    if (addressFilter && !fullAddress.includes(addressFilter.toLowerCase())) return false;

    // Filter by rating (assuming rating is a number)
    if (ratingFilter) {
      const ratingNumber = parseFloat(ratingFilter);
      if (isNaN(ratingNumber)) return true; // ignore invalid input
      const serviceRating = ratings[service.id] || 0;
      if (serviceRating < ratingNumber) return false;
    }

    // Filter by services (only check if the filter is set and serviceList is loaded for that service)
    if (serviceFilter && !serviceMatchesFilter(service)) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Se incarca serviciile auto...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3">
      <h2 className="text-center mb-3">Service-uri Auto Inregistrate</h2>

      {/* Filters */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="Cauta dupa nume service..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtreaza dupa servicii..."
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtreaza dupa adresa..."
            value={addressFilter}
            onChange={e => setAddressFilter(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="form-control"
            placeholder="Rating minim (0-5)"
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <p className="text-center text-muted">Nu au fost gasite service-uri auto care sa corespunda filtrelor.</p>
      ) : (
        <div className="row g-3">
          {filteredServices.map(service => (
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
                      Adaugat pe: {new Date(service.created_at).toLocaleDateString()}
                    </small>
                    {ratings[service.id] !== undefined && (
                      <div><small>Rating mediu: {ratings[service.id]} / 5</small></div>
                    )}
                    <div className="mt-2 d-flex gap-2 justify-content-end">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleViewServices(service.id)}
                      >
                        {expandedServiceId === service.id ? 'Ascunde servicii' : 'Vezi servicii'}
                      </button>
                      {user?.type === 1 && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleBookClick(service)}
                        >
                          Cere o programare
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service list display */}
                {expandedServiceId === service.id && (
                  <div className="card-footer">
                    {(serviceList[service.id] && serviceList[service.id].length > 0) ? (
                      <ul className="mb-0 ps-3">
                        {serviceList[service.id]?.map((s, idx) => (
                          <li key={idx}>
                            {s.title} — {s.price} RON
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted mb-0">Nicio lista de servicii disponibila.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayAutoServices;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ManageServices({ user }) {
  const [services, setServices] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
const [assigningServiceId, setAssigningServiceId] = useState(null);
const [assignForm, setAssignForm] = useState({
  name: '',
  email: '',
  password: ''
});
const [assignMessage, setAssignMessage] = useState('');

const [filters, setFilters] = useState({
  name: '',
  county: '',
  serviceTitle: ''
});

const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters(prev => ({ ...prev, [name]: value }));
};

  useEffect(() => {
    if (!user) return;

    axios.post("http://localhost/Licenta/backend/getUserAutoServices.php", { user_id: user.id })
      .then(res => setServices(res.data))
      .catch(err => console.error("Failed to fetch auto services", err));
  }, [user]);

  const handleRemove = (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    axios.post("http://localhost/Licenta/backend/deleteAutoService.php", { id })
      .then(() => setServices(prev => prev.filter(s => s.id !== id)))
      .catch(err => console.error("Error deleting service:", err));
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setEditModal(true);
  };

  const handleEditSubmit = () => {
    axios.post("http://localhost/Licenta/backend/updateAutoService.php", selectedService)
      .then(() => {
        setServices(prev => prev.map(s => s.id === selectedService.id ? selectedService : s));
        setEditModal(false);
      })
      .catch(err => console.error("Error updating service:", err));
  };

  const [addServiceMessage, setAddServiceMessage] = useState('');

  const handleOpenAssignModal = (serviceId) => {
  setAssigningServiceId(serviceId);
  setAssignForm({ name: '', email: '', password: '' });
  setAssignMessage('');
  setShowAssignModal(true);
};
  
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedAutoServiceId, setSelectedAutoServiceId] = useState(null);
  const [newService, setNewService] = useState({
  title: '',
  description: '',
  price: '',
  duration: ''
  });

const openAddServiceModal = (autoServiceId) => {
  setSelectedAutoServiceId(autoServiceId);
  setShowAddServiceModal(true);
  setNewService({ title: '', description: '', price: '', duration: '' }); // Reset form
};

const handleAddServiceSubmit = () => {
  const payload = {
    auto_service_id: selectedAutoServiceId,
    ...newService
  };

  axios.post("http://localhost/Licenta/backend/addServiceToAutoService.php", payload)
    .then(() => {
      setAddServiceMessage("✅ Service added successfully!");
      setNewService({ title: '', description: '', price: '', duration: '' });

      // Refresh the services
      axios.post("http://localhost/Licenta/backend/getUserAutoServices.php", { user_id: user.id })
        .then(res => setServices(res.data));

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setShowAddServiceModal(false);
        setAddServiceMessage('');
      }, 2000);
    })
    .catch(err => {
      console.error("Error adding service:", err);
      setAddServiceMessage("❌ Failed to add service. Please try again.");
    });
};

const [editLinkedServiceModal, setEditLinkedServiceModal] = useState(false);
const [editingLinkedService, setEditingLinkedService] = useState(null);

const handleEditLinkedService = (autoServiceId, linkedService) => {
  setEditingLinkedService({
  id: linkedService.id,  
  title: linkedService.title,
  description: linkedService.description,
  price: Number(linkedService.price),
  duration_minutes: Number(linkedService.duration_minutes),
  auto_service_id: autoServiceId
});
console.log("Linked service being edited:", linkedService);


  setEditLinkedServiceModal(true);
};

const handleDeleteLinkedService = (linkedServiceId, autoServiceId) => {
  if (!window.confirm("Are you sure you want to delete this linked service?")) return;

  axios.post("http://localhost/Licenta/backend/deleteLinkedService.php", {
    id: linkedServiceId
  })
  .then(() => {
    setServices(prev =>
      prev.map(service =>
        service.id === autoServiceId
          ? { ...service, linked_services: service.linked_services.filter(s => s.id !== linkedServiceId) }
          : service
      )
    );
  })
  .catch(err => console.error("Failed to delete linked service:", err));
};

const filteredServices = services.filter(service => {
  const nameMatch = service.name.toLowerCase().includes(filters.name.toLowerCase());
  const countyMatch = service.county.toLowerCase().includes(filters.county.toLowerCase());
  const serviceMatch = service.linked_services?.some(ls =>
    ls.title.toLowerCase().includes(filters.serviceTitle.toLowerCase())
  );
  return nameMatch && countyMatch && (!filters.serviceTitle || serviceMatch);
});


  return (
    <div className="container py-5">
      <h2 className="mb-4">Service-urile tale auto</h2>
      <div className="mb-4">
  <h5>Filtre:</h5>
  <div className="row g-2">
    <div className="col-md-4">
      <input
        type="text"
        className="form-control"
        placeholder="Filtrează după nume"
        name="name"
        value={filters.name}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-md-4">
      <input
        type="text"
        className="form-control"
        placeholder="Filtrează după județ"
        name="county"
        value={filters.county}
        onChange={handleFilterChange}
      />
    </div>
    <div className="col-md-4">
      <input
        type="text"
        className="form-control"
        placeholder="Filtrează după serviciu"
        name="serviceTitle"
        value={filters.serviceTitle}
        onChange={handleFilterChange}
      />
    </div>
  </div>
</div>

      <div className="row">
       <div className="row">
  {filteredServices.map(service => (
    <div key={service.id} className="col-md-4 mb-4">
      <div className="h-100 d-flex flex-column">
        {/* Card */}
        <div className="card shadow">
          <div className="card-body">
            <h5 className="card-title">{service.name}</h5>
            <p className="card-text mb-1"><strong>CUI:</strong> {service.VAT}</p>
            <p className="card-text mb-1">
              <strong>Adresa:</strong> {`${service.street} ${service.number}, ${service.town}, ${service.county}`}
            </p>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <button className="btn btn-outline-primary btn-sm" onClick={() => openEditModal(service)}>Editeaza</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => openAddServiceModal(service.id)}>Adauga serviciu</button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(service.id)}>Remove</button>
          </div>
        </div>

        {/* Linked services below the card, but inside the same column box */}
        {service.linked_services && service.linked_services.length > 0 && (
          <div className="mt-2 px-3 py-2 border rounded bg-light">
            <h6>Servicii:</h6>
            <ul className="mb-0">
  {service.linked_services.map((linked, idx) => (
    <li
      key={idx}
      className="d-flex justify-content-between align-items-center py-1 border-bottom"
      style={{ fontSize: "0.9rem" }}
    >
      <span className="me-2 flex-grow-1">
        <strong>{linked.title}</strong> – {linked.price} RON ({linked.duration_minutes} min)
      </span>
      <div className="d-flex gap-1">
        <button
          className="btn btn-sm btn-outline-secondary p-1"
          title="Edit"
          onClick={() => handleEditLinkedService(service.id, linked)}
        >
          <FaEdit size={14} />
        </button>
        <button
          className="btn btn-sm btn-outline-danger p-1"
          title="Delete"
          onClick={() => handleDeleteLinkedService(linked.id, service.id)}
        >
          <FaTrash size={14} />
        </button>
        </div>
          </li>
         ))}
          </ul>
          </div>
        )}
      </div>
    </div>
  ))}
</div>

      </div>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Auto Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedService?.name || ''}
                onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formStreet" className="mb-2">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                value={selectedService?.street || ''}
                onChange={(e) => setSelectedService({ ...selectedService, street: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNumber" className="mb-2">
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="text"
                value={selectedService?.number || ''}
                onChange={(e) => setSelectedService({ ...selectedService, number: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTown" className="mb-2">
              <Form.Label>Town</Form.Label>
              <Form.Control
                type="text"
                value={selectedService?.town || ''}
                onChange={(e) => setSelectedService({ ...selectedService, town: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCounty" className="mb-2">
              <Form.Label>County</Form.Label>
              <Form.Control
                type="text"
                value={selectedService?.county || ''}
                onChange={(e) => setSelectedService({ ...selectedService, county: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddServiceModal} onHide={() => setShowAddServiceModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Adauga serviciu</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label>Titlu</Form.Label>
        <Form.Control
          type="text"
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Descriere</Form.Label>
        <Form.Control
          as="textarea"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Pret</Form.Label>
        <Form.Control
          type="number"
          value={newService.price}
          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Durata (in minute)</Form.Label>
        <Form.Control
          type="number"
          value={newService.duration}
          onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
        />
      </Form.Group>
    </Form>
    {addServiceMessage && (
  <div className={`alert ${addServiceMessage.startsWith('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
    {addServiceMessage}
  </div>
)}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddServiceModal(false)}>Anuleaza</Button>
    <Button variant="success" onClick={handleAddServiceSubmit}>Adauga</Button>
  </Modal.Footer>
</Modal>
<Modal show={editLinkedServiceModal} onHide={() => setEditLinkedServiceModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Linked Service</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={editingLinkedService?.title || ''}
          onChange={(e) => setEditingLinkedService({ ...editingLinkedService, title: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          value={editingLinkedService?.description || ''}
          onChange={(e) => setEditingLinkedService({ ...editingLinkedService, description: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          value={editingLinkedService?.price || ''}
          onChange={(e) => setEditingLinkedService({ ...editingLinkedService, price: e.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Duration (minutes)</Form.Label>
        <Form.Control
          type="number"
          value={editingLinkedService?.duration_minutes || ''}
          onChange={(e) => setEditingLinkedService({ ...editingLinkedService, duration_minutes: e.target.value })}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setEditLinkedServiceModal(false)}>Cancel</Button>
    <Button
      variant="primary"
      onClick={() => {
        axios.post("http://localhost/Licenta/backend/updateLinkedService.php", editingLinkedService)
          .then(() => {
            // Update local state
            setServices(prev =>
              prev.map(service =>
                service.id === editingLinkedService.auto_service_id
                  ? {
                      ...service,
                      linked_services: service.linked_services.map(ls =>
                        ls.id === editingLinkedService.id ? editingLinkedService : ls
                      )
                    }
                  : service
              )
            );
            setEditLinkedServiceModal(false);
          })
          .catch(err => console.error("Failed to update linked service:", err));
      }}
    >
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}

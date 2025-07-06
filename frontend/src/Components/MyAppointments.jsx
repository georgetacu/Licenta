import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

export default function MyAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [availableHours, setAvailableHours] = useState([]);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [reviewAppointmentId, setReviewAppointmentId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [notification, setNotification] = useState(null);
  const [filterDate, setFilterDate] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
const [filterService, setFilterService] = useState("");


  const handleLeaveReview = (appointmentId) => {
    setReviewAppointmentId(appointmentId);
    setRating(5);
    setComment("");
    setReviewModalShow(true);
  };

  const submitReview = () => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Va rugam selectati un rating valid intre 1 si 5.");
      return;
    }

    axios.post("http://localhost/Licenta/backend/submitReview.php", {
      appointment_id: reviewAppointmentId,
      user_id: user.id,
      rating,
      comment,
    })
    .then(() => {
      setReviewModalShow(false);
      setNotification({ type: "success", message: "Recenzia a fost trimisa cu succes!" });
    })
    .catch(() => {
      setNotification({ type: "error", message: "Eroare la trimiterea recenziei." });
    });
  };

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  const fetchAppointments = () => {
    axios
      .post("http://localhost/Licenta/backend/getUserAppointments.php", {
        user_id: user.id,
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          setAppointments([]);
        }
      })
      .catch((err) => {
        console.error("Eroare la incarcarea programarilor", err);
      });
  };
  const filteredAppointments = appointments.filter((appt) => {
  const apptDate = appt.appointment_datetime.slice(0, 10); 
  const matchDate = !filterDate || apptDate === filterDate;
  const matchStatus = filterStatus === "all" || String(appt.status) === filterStatus;
  const matchService = !filterService || appt.auto_service_name.toLowerCase().includes(filterService.toLowerCase());
  return matchDate && matchStatus && matchService;
});


  const getStatusText = (status) => {
  switch (String(status)) {
    case "0":
      return "Anulat";
    case "1":
      return "In asteptarea confirmarii";
    case "2":
      return "Confirmat";
    case "3":
      return "Finalizat";   
    default:
      return "Necunoscut";
  }
};

const getStatusClass = (status) => {
  switch (String(status)) {
    case "0":
      return "bg-danger text-white";
    case "1":
      return "bg-warning text-dark";
    case "2":
      return "bg-success text-white";
    case "3":
      return "bg-success text-white";  
    default:
      return "";
  }
};

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
    setSelectedHour("");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (e.target.value) generateAvailableHours(e.target.value);
  };

  const handleRescheduleClick = (appt) => {
    setSelectedAppt(appt);
    const dt = new Date(appt.appointment_datetime);
    const isoDate = dt.toISOString().slice(0, 10);
    setSelectedDate(isoDate);

    const hourStr = dt.getHours().toString().padStart(2, "0") + ":00";
    setSelectedHour(hourStr);

    generateAvailableHours(isoDate);
    setShowRescheduleModal(true);
  };

  const handleRescheduleConfirm = () => {
    if (!selectedDate || !selectedHour) {
      alert("Selecteaza data si ora pentru reprogamare.");
      return;
    }
    const newDateTime = `${selectedDate} ${selectedHour}:00`;
    axios
      .post("http://localhost/Licenta/backend/rescheduleAppointment.php", {
        appointment_id: selectedAppt.id,
        new_datetime: newDateTime,
      })
      .then(() => {
        fetchAppointments();
        setShowRescheduleModal(false);
      })
      .catch((err) => {
        console.error("Eroare la reprogramare", err);
      });
  };

  const handleCancel = (appointmentId) => {
  const confirmCancel = window.confirm(
    "Esti sigur ca doresti sa anulezi programarea?"
  );
  if (!confirmCancel) return;

  axios
    .post(`http://localhost/Licenta/backend/cancelAppointment.php`, {
      appointment_id: appointmentId,
    })
    .then(() => {
      fetchAppointments();
    })
    .catch((error) => {
      console.error("Eroare la anulare:", error);
    });
};
  const formatDate = (datetimeStr) => {
    const dt = new Date(datetimeStr);
    const day = dt.getDate().toString().padStart(2, "0");
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const year = dt.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format time HH:mm (24h, no AM/PM)
  const formatTime = (datetimeStr) => {
    const dt = new Date(datetimeStr);
    const hours = dt.getHours().toString().padStart(2, "0");
    const minutes = dt.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Programarile mele</h4>
        </div>
        <div className="card-body">
          {appointments.length === 0 ? (
            <div className="alert alert-info text-center">
              Nu exista programari disponibile.
            </div>
          ) : (
            <><div className="mb-3 row">
                <div className="col-md-4">
                  <label className="form-label">Filtrare dupa data</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filtrare dupa status</label>
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Toate</option>
                    <option value="0">Anulat</option>
                    <option value="1">In asteptare</option>
                    <option value="2">Confirmat</option>
                    <option value="3">Finalizat</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filtrare dupa service auto</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: AutoMax"
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)} />
                </div>
              </div><div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Data</th>
                        <th>Ora</th>
                        <th>Serviciu</th>
                        <th>Service auto</th>
                        <th>Status</th>
                        <th>Actiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appt, index) => (

                        <tr key={appt.id}>
                          <td>{index + 1}</td>
                          <td>{formatDate(appt.appointment_datetime)}</td>
                          <td>{formatTime(appt.appointment_datetime)}</td>
                          <td>{appt.service_name}</td>
                          <td>{appt.auto_service_name}</td>
                          <td className={getStatusClass(appt.status)}>
                            {getStatusText(appt.status)}
                          </td>
                          <td>
                            {appt.status === 3 ? (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleLeaveReview(appt.id)}
                              >
                                Lasa recenzie
                              </button>
                            ) : (
                              <>
                                {(appt.status === 1 || appt.status === 2) && (
                                  <button
                                    className="btn btn-sm btn-danger me-2"
                                    onClick={() => handleCancel(appt.id)}
                                  >
                                    Anuleaza
                                  </button>
                                )}
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleRescheduleClick(appt)}
                                >
                                  Reprogrameaza
                                </button>
                              </>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div></>
          )}
        </div>
      </div>
      <Modal
        show={showRescheduleModal}
        onHide={() => setShowRescheduleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reprogrameaza programarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alege o data</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={handleDateChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alege ora</Form.Label>
              <Form.Select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                disabled={!selectedDate || availableHours.length === 0}
              >
                <option value="">-- Selecteaza ora --</option>
                {availableHours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRescheduleModal(false)}
          >
            Anuleaza
          </Button>
          <Button variant="success" onClick={handleRescheduleConfirm}>
            Confirma
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={reviewModalShow} onHide={() => setReviewModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lasa o recenzie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(r => (
                  <option key={r} value={r}>{r} ste{r === 1 ? "a" : "ele"}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comentariu (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Scrie aici comentariul tau..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setReviewModalShow(false)}>Anuleaza</Button>
          <Button variant="primary" onClick={submitReview}>Trimite recenzia</Button>
        </Modal.Footer>
      </Modal>
      {notification && (
        <div className={`alert alert-${notification.type === "success" ? "success" : "danger"} fixed-bottom m-3`}>
          {notification.message}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotification(null)}></button>
        </div>
      )}
    </div>
  );
}

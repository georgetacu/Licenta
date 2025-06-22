import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function OwnerAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const finalizeAppointment = async (appointmentId) => {
    try {
      const res = await fetch('http://localhost/Licenta/backend/finalizeAppointment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appointment_id: appointmentId })
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        if (data.success) {
          toast.success("Programarea a fost finalizata si notificarea a fost trimisa.");
          fetchAppointments();
        } else {
          toast.error(data.error || "Eroare la finalizare.");
        }
      } catch (jsonError) {
        console.error("Raspuns invalid:", text);
        toast.error("Raspuns invalid de la server.");
      }

    } catch (error) {
      console.error("Eroare finalizare:", error);
      toast.error("Eroare la conectarea cu serverul.");
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.post(
        "http://localhost/Licenta/backend/getOwnerAppointments.php",
        { owner_id: user.id }
      );
      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Eroare la preluarea programarilor", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (appointmentId, status) => {
    try {
      await axios.post("http://localhost/Licenta/backend/updateAppointmentStatus.php", {
        appointment_id: appointmentId,
        status,
      });
      fetchAppointments();
      toast.success(
        status === 2 ? "Programarea a fost acceptata." : "Programarea a fost refuzata."
      );
    } catch (error) {
      console.error("Eroare la actualizarea statusului", error);
      toast.error("Eroare la actualizarea programarii.");
    }
  };

  const getStatusText = (status) => {
    switch (String(status)) {
      case "0":
        return "Anulat";
      case "1":
        return "In asteptare";
      case "2":
        return "Confirmat";
      case "3":
        return "Finalizat";
      default:
        return "Necunoscut";
    }
  };

  return (
    <div className="container py-5">
      <h3>Programari pentru service-ul tau</h3>

      {loading ? (
        <p>Se incarca...</p>
      ) : appointments.length === 0 ? (
        <p>Nu exista programari disponibile.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Data si ora</th>
              <th>Client</th>
              <th>Serviciu</th>
              <th>Status</th>
              <th>Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, i) => (
              <tr key={appt.id}>
                <td>{i + 1}</td>
                <td>{new Date(appt.appointment_datetime).toLocaleString("ro-RO", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}</td>
                <td>{appt.user_name}</td>
                <td>{appt.service_title}</td>
                <td>{getStatusText(appt.status)}</td>
                <td>
                  {appt.status === 1 && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleDecision(appt.id, 2)}
                      >
                        Accepta
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDecision(appt.id, 0)}
                      >
                        Refuza
                      </button>
                    </>
                  )}
                  {appt.status === 2 && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => finalizeAppointment(appt.id)}
                    >
                      Finalizeaza
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

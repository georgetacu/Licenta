import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ro from "date-fns/locale/ro";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "ro-RO": ro,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPanel({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedServiceAuto, setSelectedServiceAuto] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost/Licenta/backend/getOwnerAppointments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner_id: user.id }), 
      });
      const data = await res.json();

      const events = data.map((appt) => {
        const start = new Date(appt.appointment_datetime);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
          id: appt.id,
          title: `${appt.service_title} - ${appt.user_name}`,
          start,
          end,
          status: appt.status,
          auto_service_id: appt.auto_service_id,      
          auto_service_name: appt.auto_service_name,  
        };
      });

      setAppointments(events);
    } catch (error) {
      console.error("Eroare la incarcarea programarilor", error);
    }
  };

  const uniqueServiceAutos = Array.from(
    new Map(appointments.map((a) => [a.auto_service_id, a.auto_service_name])).entries()
  );

  const filteredAppointments = selectedServiceAuto
    ? appointments.filter((appt) => String(appt.auto_service_id) === selectedServiceAuto)
    : appointments;

  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(18, 0, 0);

  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(end, "HH:mm", culture)}`,
  };

return (
  <div style={{ height: "90vh", padding: 20, display: "flex", gap: 20 }}>
    <div style={{ minWidth: 200 }}>
      <h5>Legenda:</h5>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        <li style={{ marginBottom: 8 }}>
          <span
            style={{
              backgroundColor: "#3174ad",
              padding: "4px 12px",
              color: "white",
              borderRadius: 4,
              marginRight: 8,
              display: "inline-block",
              width: 20,
              height: 20,
            }}
          >
            &nbsp;
          </span>
          In asteptare
        </li>
        <li style={{ marginBottom: 8 }}>
          <span
            style={{
              backgroundColor: "#5cb85c",
              padding: "4px 12px",
              color: "white",
              borderRadius: 4,
              marginRight: 8,
              display: "inline-block",
              width: 20,
              height: 20,
            }}
          >
            &nbsp;
          </span>
          Confirmat
        </li>
        <li style={{ marginBottom: 8 }}>
          <span
            style={{
              backgroundColor: "#6c757d",
              padding: "4px 12px",
              color: "white",
              borderRadius: 4,
              marginRight: 8,
              display: "inline-block",
              width: 20,
              height: 20,
            }}
          >
            &nbsp;
          </span>
          Finalizat
        </li>
        <li>
          <span
            style={{
              backgroundColor: "#d9534f",
              padding: "4px 12px",
              color: "white",
              borderRadius: 4,
              marginRight: 8,
              display: "inline-block",
              width: 20,
              height: 20,
            }}
          >
            &nbsp;
          </span>
          Anulat
        </li>
      </ul>
    </div>

    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h2>Calendar programari</h2>

      <div className="mb-3" style={{ maxWidth: 300 }}>
        <label className="form-label">Filtreaza dupa service auto:</label>
        <select
          className="form-select"
          value={selectedServiceAuto}
          onChange={(e) => setSelectedServiceAuto(e.target.value)}
        >
          <option value="">Toate service-urile</option>
          {uniqueServiceAutos.map(([id, name]) => (
            <option key={id} value={String(id)}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredAppointments}
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        step={30}
        timeslots={2}
        defaultDate={new Date()}
        style={{ height: "100%", flexGrow: 1 }}
        min={minTime}
        max={maxTime}
        formats={formats}
        eventPropGetter={(event) => {
          let backgroundColor = "#3174ad";
          if (event.status === 0) backgroundColor = "#d9534f";
          else if (event.status === 2) backgroundColor = "#5cb85c";
          else if (event.status === 3) backgroundColor = "#6c757d";
          return { style: { backgroundColor } };
        }}
      />
    </div>
  </div>
);

}

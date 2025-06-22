import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ro from "date-fns/locale/ro"; // import Romanian locale
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
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
        return {
          id: appt.id,
          title: `${appt.service_title} - ${appt.user_name}`,
          start,
          end,
          status: appt.status,
        };
      });

      setAppointments(events);
    } catch (error) {
      console.error("Error loading appointments", error);
    }
  };

  // Set min/max visible times for the day (9:00 to 18:00)
  const minTime = new Date();
  minTime.setHours(9, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(18, 0, 0);

  // Formats to remove am/pm, show 24h time
  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(end, "HH:mm", culture)}`,
  };

  return (
    <div style={{ height: "90vh", padding: 20 }}>
      <h2>Calendar programari</h2>
      <Calendar
        localizer={localizer}
        events={appointments}
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        step={30}
        timeslots={2}
        defaultDate={new Date()}
        style={{ height: "100%" }}
        min={minTime}
        max={maxTime}
        formats={formats}
        eventPropGetter={(event) => {
          let backgroundColor = "#3174ad"; // default blue
          if (event.status === 0) backgroundColor = "#d9534f"; // red canceled
          else if (event.status === 2) backgroundColor = "#5cb85c"; // green confirmed
          else if (event.status === 3) backgroundColor = "#6c757d"; // gray finalized
          return { style: { backgroundColor } };
        }}
      />
    </div>
  );
}

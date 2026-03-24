import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getUserEvents } from "../Api/api";
import { useEffect, useState } from "react";

export default function Eventlist({ id }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!id) return;

    const loadEvents = async () => {
      const data = await getUserEvents(id);

      // 🔑 adaptar a formato FullCalendar
      const formatted = data.map((e) => ({
        title: e.title,
        start: e.time ? `${e.date}T${e.time}` : e.date, // all-day si no hay hora
      }));

      setEvents(formatted);
    };

    loadEvents();
  }, [id]);

  return (
    <div className="bg-gray-900 shadow rounded p-4 ">
      <h2 className="font-semibold mb-4 text-white">Agenda</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
}

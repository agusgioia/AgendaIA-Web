import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getUserEvents } from "../Api/api";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";

export default function Eventlist({ id }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadEvents = async () => {
      const data = await getUserEvents(id);

      const formatted = data.map((e) => {
        const dateTime = e.time
          ? new Date(`${e.date}T${e.time}`)
          : new Date(e.date);

        return {
          title: e.title,
          start: dateTime,
        };
      });
      console.log(formatted);
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
        dayMaxEventRows={2}
        eventClick={(info) => {
          setSelectedEvent(info.event);
          setShowModal(true);
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      <Dialog
        header={selectedEvent ? selectedEvent.title : "Evento"}
        visible={showModal}
        onHide={() => setShowModal(false)}
        style={{ width: "30rem" }}
        breakpoints={{ "960px": "75vw", "640px": "95vw" }}
        className="custom-dialog"
        modal
        dismissableMask
      >
        {selectedEvent && (
          <div className="flex flex-col gap-3 text-gray-200">
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-gray-400 text-sm">Fecha</span>
              <p className="font-semibold">
                {selectedEvent.start.toLocaleDateString()}
              </p>
            </div>

            {selectedEvent.start.getHours() !== 0 && (
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-gray-400 text-sm">Hora</span>
                <p className="font-semibold">
                  {selectedEvent.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getUserEvents,
  deleteEvent,
  updateEvent,
  createEvent,
} from "../Api/api";
import { Dialog } from "primereact/dialog";

export default function Eventlist({ id, email }) {
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    time: "",
    reminderMinutes: "",
  });
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getUserEvents(id);
      setRawEvents(data);
      setEvents(
        data.map((e) => ({
          id: String(e.id),
          title: e.title,
          start: e.time ? new Date(`${e.date}T${e.time}`) : new Date(e.date),
        })),
      );
    } catch (e) {
      console.error("Error cargando eventos", e);
    }
  }, [id]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // 👉 CLICK EN EVENTO = EDIT
  const handleEventClick = (info) => {
    const raw = rawEvents.find((e) => String(e.id) === info.event.id);

    setSelectedEvent({ calEvent: info.event, raw });

    setEditForm({
      title: raw.title,
      date: raw.date,
      time: raw.time?.substring(0, 5) ?? "",
      reminderMinutes: raw.reminderMinutes ?? "",
    });

    setError("");
    setShowModal(true);
  };

  // 👉 CLICK EN DÍA = CREATE
  const handleDateClick = (info) => {
    setSelectedEvent(null);
    setError("");

    setEditForm({
      title: "",
      date: info.dateStr,
      time: "",
      reminderMinutes: "",
    });

    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.date) {
      setError("El título y la fecha son obligatorios.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent.raw.id, {
          title: editForm.title,
          date: editForm.date,
          time: editForm.time || null,
          reminderMinutes: editForm.reminderMinutes || null,
        });
      } else {
        await createEvent(
          {
            userId: id,
            title: editForm.title,
            date: editForm.date,
            time: editForm.time || null,
            reminderMinutes: editForm.reminderMinutes || null,
          },
          email,
        );
      }

      setShowModal(false);
      setSelectedEvent(null);
      await loadEvents();
    } catch (e) {
      setError("No se pudo guardar el evento.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent?.raw?.id) return;

    setDeleting(true);
    setError("");

    try {
      await deleteEvent(selectedEvent.raw.id);
      setShowModal(false);
      setSelectedEvent(null);
      await loadEvents();
    } catch (error) {
      setError("No se pudo eliminar el evento." + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition";

  const labelClass = "block text-gray-400 text-xs mb-1.5";

  return (
    <div className="bg-gray-900 shadow rounded p-4">
      <h2 className="font-semibold mb-4 text-white">Agenda</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dayMaxEventRows={2}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      <Dialog
        header={selectedEvent ? "Editar evento" : "Nuevo evento"}
        visible={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
        style={{ width: "30rem" }}
        breakpoints={{ "960px": "75vw", "640px": "95vw" }}
        className="custom-dialog"
        modal
        dismissableMask
      >
        <div className="flex flex-col gap-3 text-gray-200">
          <div>
            <label className={labelClass}>Título</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Fecha</label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) =>
                setEditForm({ ...editForm, date: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hora</label>
            <input
              type="time"
              value={editForm.time}
              onChange={(e) =>
                setEditForm({ ...editForm, time: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Recordatorio</label>
            <select
              value={editForm.reminderMinutes ?? ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  reminderMinutes: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
              className={inputClass}
            >
              <option value="">Sin recordatorio</option>
              <option value="10">10 minutos antes</option>
              <option value="30">30 minutos antes</option>
              <option value="60">1 hora antes</option>
              <option value="1440">1 día antes</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
              ⚠ {error}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            {selectedEvent && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition"
              >
                {deleting ? "Eliminando..." : "🗑 Eliminar"}
              </button>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl py-2.5 text-sm transition"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

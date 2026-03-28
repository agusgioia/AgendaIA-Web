import { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getUserEvents, deleteEvent, updateEvent } from "../Api/api";
import { Dialog } from "primereact/dialog";

export default function Eventlist({ id }) {
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", date: "", time: "" });
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

  const handleEventClick = (info) => {
    const raw = rawEvents.find((e) => String(e.id) === info.event.id);
    setSelectedEvent({ calEvent: info.event, raw });
    setEditing(false);
    setError("");
    setShowModal(true);
  };

  const handleEditOpen = () => {
    setEditForm({
      title: selectedEvent.raw.title,
      date: selectedEvent.raw.date,
      time: selectedEvent.raw.time?.substring(0, 5) ?? "",
    });
    setError("");
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setError("");
  };

  const handleEditSave = async () => {
    if (!editForm.title.trim() || !editForm.date) {
      setError("El título y la fecha son obligatorios.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateEvent(selectedEvent.raw.id, {
        title: editForm.title,
        date: editForm.date,
        time: editForm.time || null,
      });
      setShowModal(false);
      setEditing(false);
      setSelectedEvent(null);
      await loadEvents();
    } catch (e) {
      setError("No se pudo guardar el evento. Intentá de nuevo.");
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
    } catch (e) {
      setError("No se pudo eliminar el evento. Intentá de nuevo.");
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return null;
    if (date.getHours() === 0 && date.getMinutes() === 0) return null;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />

      <Dialog
        header={
          editing
            ? "Editar evento"
            : (selectedEvent?.calEvent?.title ?? "Evento")
        }
        visible={showModal}
        onHide={() => {
          setShowModal(false);
          setEditing(false);
        }}
        style={{ width: "30rem" }}
        breakpoints={{ "960px": "75vw", "640px": "95vw" }}
        className="custom-dialog"
        modal
        dismissableMask
      >
        {selectedEvent && (
          <div className="flex flex-col gap-3 text-gray-200">
            {editing ? (
              <>
                {/* Formulario de edición */}
                <div>
                  <label className={labelClass}>Título</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Título del evento"
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
                  <label className={labelClass}>Hora (opcional)</label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm({ ...editForm, time: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
                    ⚠ {error}
                  </div>
                )}

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleEditCancel}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl py-2.5 text-sm transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={saving}
                    className="flex-1 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-2.5 text-sm transition"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Vista de detalle */}
                <div className="bg-gray-800 p-3 rounded">
                  <span className="text-gray-400 text-sm">Fecha</span>
                  <p className="font-semibold">
                    {selectedEvent.calEvent.start.toLocaleDateString()}
                  </p>
                </div>

                {formatTime(selectedEvent.calEvent.start) && (
                  <div className="bg-gray-800 p-3 rounded">
                    <span className="text-gray-400 text-sm">Hora</span>
                    <p className="font-semibold">
                      {formatTime(selectedEvent.calEvent.start)}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
                    ⚠ {error}
                  </div>
                )}

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleEditOpen}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl py-2.5 text-sm transition"
                  >
                    ✏ Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-2.5 text-sm transition"
                  >
                    {deleting ? "Eliminando..." : "🗑 Eliminar"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}

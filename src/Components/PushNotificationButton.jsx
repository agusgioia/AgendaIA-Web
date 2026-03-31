import usePushNotifications from "../Hooks/usePushNotifications";

const messages = {
  idle: {
    text: "🔔 Activar recordatorios",
    style: "bg-sky-500 hover:bg-sky-400 text-white",
  },
  loading: {
    text: "Activando...",
    style: "bg-gray-700 text-gray-400 cursor-not-allowed",
  },
  granted: {
    text: "✓ Recordatorios activos",
    style: "bg-emerald-600 text-white cursor-default",
  },
  denied: {
    text: "Permiso denegado",
    style: "bg-red-900 border border-red-700 text-red-300 cursor-default",
  },
  unsupported: {
    text: "No soportado en este browser",
    style: "bg-gray-800 text-gray-500 cursor-default",
  },
  blocked: { 
    text: "⚙ Habilitá notificaciones desde la configuración", 
    style: "bg-yellow-900 border border-yellow-700 text-yellow-300 cursor-default" 
  }
};

export default function PushNotificationButton({ userId }) {
  const { status, subscribe } = usePushNotifications(userId);
  const { text, style } = messages[status];

  return (
    <button
      onClick={status === "idle" ? subscribe : undefined}
      disabled={status === "loading"}
      className={`w-full rounded-xl py-2.5 px-4 text-sm font-medium transition ${style}`}
    >
      {text}
    </button>
  );
}

import { useState } from "react";
import OneSignal from "react-onesignal";

export default function usePushNotifications(userId) {
  const [status, setStatus] = useState("idle");

  const subscribe = async () => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("blocked");
      return;
    }

    setStatus("loading");
    try {
      await OneSignal.Notifications.requestPermission();
      if (OneSignal.Notifications.permission) {
        await OneSignal.User.addTag("userId", String(userId));
        setStatus("granted");
      } else {
        setStatus("blocked");
      }
    } catch (e) {
      console.error("Error activando notificaciones:", e);
      setStatus("denied");
    }
  };

  return { status, subscribe };
}

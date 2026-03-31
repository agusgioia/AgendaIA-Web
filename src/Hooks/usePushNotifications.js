import { useState } from "react";
import { requestNotificationPermission } from "../../firebase";
import { updateFcmToken } from "../Api/api";

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
      const token = await requestNotificationPermission();
      if (!token) {
        setStatus("blocked");
        return;
      }
      await updateFcmToken(userId, token);
      setStatus("granted");
    } catch (e) {
      console.error("Error activando notificaciones:", e);
      setStatus("denied");
    }
  };

  return { status, subscribe };
}

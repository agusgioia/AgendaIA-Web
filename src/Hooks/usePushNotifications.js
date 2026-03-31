import { useState } from "react";
import { requestNotificationPermission } from "../../firebase";
import { updateFcmToken } from "../Api/api";

export default function usePushNotifications(userId) {
  const [status, setStatus] = useState("idle");

  const subscribe = async () => {
    if (!("Notification" in window)) {
      console.log("Notificaciones no soportadas");
      setStatus("unsupported");
      return;
    }

    console.log("Permiso actual:", Notification.permission);
    setStatus("loading");

    try {
      const permission = await Notification.requestPermission();
      console.log("Permiso obtenido:", permission);

      const token = await requestNotificationPermission();
      console.log("Token:", token);

      if (!token) {
        setStatus("denied");
        return;
      }
      await updateFcmToken(userId, token);
      setStatus("granted");
    } catch (e) {
      console.error("Error completo:", e);
      setStatus("denied");
    }
  };

  return { status, subscribe };
}
